/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 function fetchArticles() {
	clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(clients){
		//ToDo: Replace for loop for forEach() call.
		for (var i = 0; i < clients.length; i++) {
			var anchorLocation = clients[i].url.indexOf('#');
			var anchorName = clients[i].url.slice(anchorLocation + 1);
			if (anchorLocation != -1) {
				fetch('https://www.reddit.com/r/' + anchorName + '.json')
					.then(function(response) {
						return response.json();
					}).then(function(json) {
						caches.open('articles').then(function(aCache) {
							json.data.children.forEach(function(child) {
								if (child.data.domain == ('self.' + anchorName)) {
									var jsonUrl = child.data.url.slice(0, -1) + '.json';
									var req = new Request(jsonUrl, {mode: 'cors'});
									aCache.add(req);
								}
							})
						})
					})
			}
		}
	}).catch(function(err) {
		console.log("Didn't work. Here's what happened: " + err);
	})
 }

function fetchTitles() {
	caches.open('subreddits').then(function(cache) {
		cache.keys().then(function(requests){
			requests.forEach(function(request) {
				var newRequest = Request(request, {mode: 'cors'});
				fetch(newRequest).then(function(response) {
					//Start here. Get the actual titles.
				})
			})
		})
	})
}

 self.addEventListener('sync', function(event) {
 	if (event.tag == 'articles') {
		fetchArticles();
 	} else if (event.tag == 'titles') {
 		fetchTitles();
 	}
 });

