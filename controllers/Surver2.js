module.exports = async (req, res) => {
    try {
      // Collect form data
      const formData = req.body;
  
      // Create inputData string for prediction
      const inputData = [
        formData['อายุ'],
        formData['อาชีพ'],
        formData['รายได้เฉลี่ยต่อเดือน'],
        formData['ระดับการศึกษา'],
        formData['จำนวนสมาชิกในครอบครัว (รวมผู้ตอบแบบสอบถาม)'],
        formData['ลักษณะที่อยู่อาศัยเดิม'],
        formData['กรรมสิทธิ์การถือครองที่อยู่อาศัยเดิมเป็นรูปแบบใด'],
        formData['งานอดิเรก'],
        formData['วัตถุประสงค์ของการซื้อที่อยู่อาศัย'],
        formData['งบประมาณที่ตั้งไว้ในการซื้อที่อยู่อาศัย'],
        formData['ความสะดวกสบายด้านการเดินทาง'],
        formData['สภาพแวดล้อม'],
        formData['มีโปรโมชั่น เช่น ส่วนลดหรือของแถม'],
        formData['พนักงานขายให้บริการดี'],
        formData['พื้นที่ตั้งของโครงการ'],
        formData['การบริการและความปลอดภัย'],
        formData['สามารถแบ่งพื้นที่ใช้สอย'],
        formData['การซื้อแบบกู้ธนาคาร'],
      ]
      .map(item => Array.isArray(item) ? item.join(', ') : item)
      .join(','); // Joining the form data into a single string
  
      console.log(`Input Data for Prediction: ${inputData}`);
  
      // Send the inputData to your prediction model (Weka or similar)
      const fetch = require('node-fetch');
  
      const response = await fetch('http://localhost:8080/predict2', {
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
  
      // Log the prediction result
      console.log("Prediction result is:", predictionResult);
  
      // Render the prediction result in your EJS view
      res.render('resultpredict2', {
        loggedIn: req.session.loggedIn,
        predictionResult: predictionResult
      });
  
    } catch (err) {
      console.error('Unexpected Error:', err);
      res.status(500).send('An error occurred.');
    }
  };
  