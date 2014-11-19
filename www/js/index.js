/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	isPhoneGapApp: !!window.cordova,
	defaultContents: {
		contacts: [
			{id: "12", displayName: "Toto \"test\"", nickname: "toto", photos: []},
			{id: "25", nickname: "titi", photos: []},
			{id: "29", name: {formatted: "<Tata>"}, photos: []},
			{id: "36", displayName: "Tata", photos: [{type: "url", value: "https://s3.amazonaws.com/uifaces/faces/twitter/fffabs/48.jpg"}]}
		]
	},
	local_contacts: {},
	selected_contacts: {},
// Application Constructor
	initialize: function () {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function () {

		if (app.isPhoneGapApp) {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		} else {
			document.addEventListener('DOMContentLoaded', this.domContentReady, false);
		}
		document.getElementById("contacts-list-validate").addEventListener("click", app.onContactsListValidate, false);
		document.getElementById("get-location").addEventListener("click", app.onGetLocation, false);
		document.getElementById("get-message").addEventListener("click", app.onGetMessage, false);
		document.getElementById("get-picture").addEventListener("click", app.onGetPicture, false);
	},
	onContactsListValidate: function () {
		var checked_contacts = document.getElementById("contacts-list").querySelectorAll(".check>input[type=checkbox]:checked");
		if (!checked_contacts) {
			//TODO: alert toast
			return false;
		}
		var selected_contacts = [];
		Array.prototype.forEach.call(
				checked_contacts, function (checkbox) {
					var contact = app.local_contacts[checkbox.value];
					if (!contact) {
						return;
					}
					selected_contacts.push(contact);
					console.log(checkbox.value, contact);
				}
		);
		document.getElementById("message-interface").classList.remove("off-screen");
		if (navigator.geolocation) {
			app.startLocation();
			document.getElementById("get-location").addEventListener("clich", app.startLocation, false);
		} else {
			console.error("Geolocalisation not supported");
			document.getElementById("location-preview").parentNode.classList.addClass("hidden");
		}
	},
	startLocation: function () {
		navigator.geolocation.getCurrentPosition(
				app.onLocationSuccess,
				app.onLocationError,
				{
					enableHighAccuracy: false,
					timeout: 10000,
					maximumAge: 5000
				}
		);
		}
		onLocationSuccess: function (selected_contacts, position) {

		console.log("test1");
		var map = document.getElementById("location-preview");
		map.classList.remove("hidden");
		console.dir(position);
		map.style.backgroundImage = "url(https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=12&size=" + map.offsetWidth + "x" + map.offsetHeight + "&maptype=roadmap&markers=color:green%7Clabel:A%7C" + position.coords.latitude + "," + position.coords.longitude + ")";
	},
	onLocationError: function (selected_contacts, error) {
		document.getElementById("location-preview").classList.add("hidden");
		console.error("Geolocalisation Fail", error);
	},
	onGetLocation: function () {

	},
	onGetMessage: function () {
	},
	onGetPicture: function () {
	},
// deviceready Event Handler
//
// The scope of 'this' is the event. In order to call the 'receivedEvent'
// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function () {
		app.receivedEvent('deviceready');
		var options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		//champs retournés
		//options.desiredFields = [navigator.contacts.fieldType.id, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, contact.photos];
//[navigator.contacts.fieldType.id];
		var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
		navigator.contacts.find(fields, app.onContactFoundSuccess, app.onContactFoundError, options);
	},
	domContentReady: function () {
		app.receivedEvent('domContentReady');
		app.onContactFoundSuccess(app.defaultContents.contacts);
	},
	// Update DOM on a Received Event
	receivedEvent: function (id) {

		console.log('Received Event: ' + id);
	},
	onContactFoundSuccess: function (contacts) {
		console.dir(contacts);
		var contact_list = document.getElementById("contacts-list");
		contact_list.innerHTML = "";
		var contacts_str = [];
		app.local_contacts = {};
		contacts.forEach(function (contact) {
			if (!contact.displayName
					&& !contact.nickname
					&& (!contact.name || !contact.name.formatted)) {
				return;
			}
			contacts_str.push("<li>\
								<a href=\"#contact-" + contact.id + "\" class=\"contact\">");
			if (contact.photos && contact.photos[0]) {
				switch (contact.photos[0].type) {
					case "url" :
						contacts_str.push("<img src=\"" + contact.photos[0].value + "\" class=\"avatar\"/>");
						break;
					case "data" :
						contacts_str.push("<img src=\"data:image/jpeg;base64," + contact.photos[0].value + "\" alt=\"photo\" class=\"avatar\"/>");
						break;
				}
			}
			contacts_str.push("<h2>" + (contact.displayName || contact.nickname || contact.name.formatted).htmlEntities() + "</h2>\
								</a>\
								<label class=\"check\">\
								 <input type=\"checkbox\" name=\"contact[" + contact.id + "]\" value=\"" + contact.id + "\"/>\
								</label>\
								</li>");
			app.local_contacts[contact.id] = contact;
		});
		contact_list.innerHTML = contacts_str.join("");
		var contacts_avatars = contact_list.querySelectorAll(".avatar");
		Array.prototype.forEach.call(
				contacts_avatars, function (img) {
					img.onerror = function () {
						img.parentNode.removeChild(img);
					}
				}
		);
	},
	onContactFoundError: function (id) {
		console.log('onContactFoundErrort: ' + id);
	}
};
app.initialize();