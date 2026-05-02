import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs"
import dotenv from 'dotenv'
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

import Event from '../models/eventModel.js';
dotenv.config()

//configuration

cloudinary.config({
  cloud_name: 'dyfxrhlby',
  api_key: '664234376222747',
  api_secret: 'v8C4J55wtUnj-6a7M46LtEBQlRM'
});


const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const updateData = { ...req.body };

    // ✅ If new image uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);

      if (result) {
        updateData.eventImage = result.secure_url;
      }

      // delete local file
      fs.unlinkSync(req.file.path);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {

    res.status(500).json({ message: "Update failed" });
  }
};

export default updateEvent; // ✅ renamed

