const predictClassification = require("../services/inferenceService");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  try {
    console.log("Storing data...");
    await storeData(id, data);
    console.log("Data stored successfully.");
  } catch (error) {
    console.error("Error while storing data:", error);
    return h
      .response({
        status: "error",
        message: "Failed to store data in Firebase",
      })
      .code(500);
  }

  return h
    .response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    })
    .code(201);
}

async function getAllPredict(request, h) {
  try {
    const db = new Firestore();
    const ref = db.collection("prediction");
    const snapshot = await ref.get();

    if (snapshot.empty) {
      return h
        .response({
          status: "error",
          message: "No prediction history found",
        })
        .code(404);
    }

    const historyData = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      historyData.push({
        id: doc.id,
        history: data,
      });
    });

    return h
      .response({
        status: "success",
        data: historyData,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching prediction history:", error);
    return h
      .response({
        status: "error",
        message: "Failed to fetch prediction history",
      })
      .code(500);
  }
}

module.exports = { postPredictHandler, getAllPredict };
