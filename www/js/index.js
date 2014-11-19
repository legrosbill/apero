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
			{id: "12", displayName: "Toto", nickname: "toto", photos: []},
			{id: "25", nickname: "titi", photos: []},
			{id: "29", name: {formatted: "Tata"}, photos: []},
			{id: "36", displayName: "Tata", photos: [{type: "url", value: "https://s3.amazonaws.com/uifaces/faces/twitter/fffabs/48.jpg"}]}
		]
	},
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
		var contacts_str = new Array();
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
			contacts_str.push("<h2>" + (contact.displayName || contact.nickname || contact.name.formatted) + "</h2>\
								</a>\
								<label class=\"check\">\
								 <input type=\"checkbox\" name=\"contact[" + contact.id + "]\" />\
								</label>\
								</li>");
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