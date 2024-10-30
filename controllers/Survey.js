module.exports = async (req, res) => {
  try {
    // Collect form data
    const formData = req.body;

    // Create inputData string for prediction
    const inputData = [
      formData['อายุ'],
      formData['สถานะภาพ'],
      formData['อาชีพ'],
      formData['รายได้เฉลี่ยต่อเดือน'],
      formData['ระดับการศึกษา'],
      formData['จำนวนสมาชิกในครอบครัว (รวมผู้ตอบแบบสอบถาม)'],
      formData['ลักษณะที่อยู่อาศัยเดิม'],
      formData['กรรมสิทธิ์การถือครองที่อยู่อาศัยเดิมเป็นรูปแบบใด'],
      formData['งานอดิเรก'],
      formData['รูปแบบการเดินทางไปทำงาน'],
      formData['ที่พักอาศัยปัจจุบันอยู่ในแหล่งชุมชนหรือไม่'],
      formData['ที่พักอาศัยปัจจุบันอยู่บริเวณหรือใกล้ตลาดหรือไม่'],
      formData['สถานที่ทำงานปัจจุบันอยู่ใกล้ที่พักอาศัยปัจจุบันหรือไม่'],
      formData['การเดินทางระหว่างที่พักอาศัยปัจจุบันกับที่ทำงานสะดวกหรือไม่'],
      formData['ประเภทที่อยู่อาศัยที่สนใจ'],
      formData['วัตถุประสงค์ของการซื้อที่อยู่อาศัย'],
      formData['งบประมาณที่ตั้งไว้ในการซื้อที่อยู่อาศัย'],
      formData['มีตัวอย่างบ้านให้ดูก่อน'],
      formData['พนักงานขายให้บริการดี'],
      formData['มีบริการติดต่อกับผู้ให้สินเชื่อ'],
      formData['พื้นที่ตั้งของโครงการ'],
      formData['การบริการและความปลอดภัย'],
      formData['สามารถแบ่งพื้นที่ใช้สอย'],
      formData['การซื้อแบบเงินสด'],
      formData['การซื้อแบบกู้ธนาคาร'],
      formData['การซื้อแบบทั้งกู้ธนาคารและใช้เงินสด']
    ]
    .map(item => Array.isArray(item) ? item.join(', ') : item)
    .join(','); // Joining the form data into a single string

    console.log(`Input Data for Prediction: ${inputData}`);

    // Send the inputData to your prediction model (Weka or similar)
    const fetch = require('node-fetch');

    const response = await fetch('http://localhost:8080/predict1', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: inputData // Sending inputData for prediction
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Prediction request failed');
    }

    const predictionData = await response.json();
    const predictionResult = predictionData.prediction;

    // If prediction is successful, pass the result to your EJS view
    if (predictionResult === 0) {
      console.log('Prediction: User can buy a house. Saving survey.');

      // Save form data to a CSV file
      const fs = require('fs');
      const path = require('path');
      const createCsvWriter = require('csv-writer').createObjectCsvWriter;

      const resultsDir = path.join(__dirname, 'results');
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir); // Create the directory if it doesn't exist
      }

      const filePath = path.join(resultsDir, 'survey_results.csv');
      const row = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value]));

      const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(row).map(key => ({ id: key, title: key })), // Create headers from keys
        append: true // Append mode to keep adding new entries
      });

      await csvWriter.writeRecords([row]); // Save the form data as a new record
      console.log('Survey results saved successfully.');
    } else {
      console.log('Prediction: User cannot buy a house. Survey not saved.');
    }
    console.log("Prediction result is:", predictionResult);
    res.render('resultpredict1', {
      loggedIn: req.session.loggedIn,
      predictionResult: predictionResult,
    });

  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).send('An error occurred.');
  }
};
