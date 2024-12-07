const tf = require("@tensorflow/tfjs-node");

async function predictClassification(model, image) {
  try {
    let imgTensor = tf.node.decodeImage(image);
    if (imgTensor.shape[2] === 4) {
      imgTensor = imgTensor.slice([0, 0, 0], [-1, -1, 3]);
    }
    imgTensor = imgTensor
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(imgTensor);
    const score = await prediction.data();
    const probability = Math.max(...score) * 100;
    const classResult = probability > 50 ? "Cancer" : "Non-cancer";
    const label = classResult;

    let suggestion;

    if (label === "Cancer") {
      suggestion = "Segera periksa ke dokter!";
    }

    if (label === "Non-cancer") {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion };
  } catch (error) {
    throw new Error(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
