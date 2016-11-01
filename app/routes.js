var Subjects = require('./models/SubjectViews');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes	
	// sample api route
 app.get('/api/data', function(req, res) {
  // use mongoose to get all nerds in the database
  /* Subjects.find({"Make":{$ne :"CHEVROLET"},"DateOfStop": {$ne :""},"Longitude": {$ne :""},"Latitude": {$ne :""}}, {'_id': 0,'VehicleType':1,'Make':1,'Race':1,'DateOfStop':1,'Year':1,'TimeOfStop':1,'Gender': 1,'Alcohol':1,'Belts':1,'Accident':1,'Longitude':1,'Latitude':1,'PersonalInjury':1,'ViolationType':1,'Color':1,'ArrestType':1},{limit : 1000},  */
  Subjects.find({"Arrest":{$ne :""},"District": {$ne :""},"Date": {$ne :""},"Date_two": {$ne :""},"LocationDescription": {$ne :""},"Longitude": {$ne :""},"Latitude": {$ne :""}}, {'_id': 0,'Date_two':1, 'Arrest': 1, 'District': 1, 'Date': 1, 'Year': 1, 'Domestic': 1, 'LocationDescription': 1, 'UpdatedOn': 1, 'CaseNumber': 1, 'PrimaryType': 1, 'Description': 1,'Longitude':1,'Latitude':1},{limit : 2000},
  function(err, subjectDetails) {
   // if there is an error retrieving, send the error. 
       // nothing after res.send(err) will execute
   if (err) 
   res.send(err);
    res.json(subjectDetails); // return all nerds in JSON format
  });
 });

 



 // frontend routes =========================================================
 app.get('*', function(req, res) {
  res.sendfile('./public/login.html');
 });
}