const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1: Get all Notes using:GET "/api/auth/getallnotes". Does reqruied Authenticate
router.get("/getallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 2: Create a new notes using:POST "/api/auth/createnote". Does reqruied Authenticate
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Title should be at least 3 characters.").isLength({
      min: 3,
    }),
    body(
      "description",
      "Description should be at least 5 characters."
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there are errors, return Bed Request and the errors
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.send({ errors: result.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNotes = await notes.save();
      res.json(saveNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
