const mongoose = require('mongoose');
const express = require('express');
const opn = require('opn');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost/rightDoctors', {useNewUrlParser: true});
let personSchema = new mongoose.Schema({
	name: String,
	age: Number,
	gender: String,
	contact: Number
})
let Person = mongoose.model('Person', personSchema);


app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function (req, res) {
	res.send("hi");
})

app.get('/person', function (req, res) {

	console.log('hello');

	Person.find({}, function (err, persons) {
		if(err) {

			res.status(500).json({
				success: false,
				message: 'could not fetch persons'
			});
		}
		else {
			res.status(200).json({
				success: true,
				message: 'persons received',
				data: {
					persons
				}
			})
		}
	})

})

app.post('/person', function (req, res) {

	let name = req.body.name;
	let age = Number(req.body.age);
	let gender = req.body.gender;
	let contact = Number(req.body.contact);

	if(name === undefined || age === undefined || gender === undefined || contact === undefined) {

		res.status(400).json({
			success: false,
			message: 'Usage: [POST] name=NAME&age=AGE&gender=GENDER&contact=CONTACT'
		});
		return;
	}

	Person.create({
		name,
		age,
		gender,
		contact
	}, function (err, inserted) {
		
		if(err) {
			res.status(500).json({
				success: false,
				message: 'Could not insert new person'
			});
		} else {

			res.status(200).json({
				success: true,
				message: 'person inserted'
			});
		}
	})	
})

app.listen(5000, function () {
	opn('http://localhost:5000');
	console.log('Started at http://localhost:5000');
})