const express = require('express')
const body_parser = require('body-parser')
const request = require('request')
const { JSDOM } = require('jsdom')
const cors = require('cors')

const app = express()
app.use(body_parser.json())
app.use(cors())

app.get('/contributions', function (req, res) {
  const github_id = req.query.github_id

  request(`https://github.com/users/${github_id}/contributions`, (e, response, body) => {
    if (e) {
      console.log(e);
      res.status(500).end()
      return
    }
    if (response.statusCode === 404) {
      console.log("not found");
      res.status(404).end()
      return
    } else if (response.statusCode !== 200) {
      res.status(response.statusCode).end()
      return
    }
    const dom = new JSDOM(body);
    try {
      const contrib = parseInt(
        dom.window.document.querySelector("h2").textContent.trim().split(" ")[0].replace(/,/g, "")
      )
      if (isNaN(contrib)) {
        console.log("Failed to parse contributions")
        res.status(500).end()
        return
      }
      res.send({ contributions: contrib })
    } catch (e) {
      res.status(500).end()
      return
    }
  })
})

app.listen(process.env.PORT || 3000)
