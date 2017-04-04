##Original project 
[https://github.com/YovkaHan/test-app-for-devsterlab]

"Sort&Search" 
Task : 
<ul>
	<li>Upload users on request {url: ‘https://jsonplaceholder.typicode.com/users’ , method: ‘GET’}</li>
	<li>Search for users by: 'name', 'username', 'email'</li>
	<li>Sorting 'name' (default), 'username', 'email', 'address.street', 'company.name' alphabetically, with the ability to switch descending and ascending</li>
	<li>Instead of 'address.geo' show the distance from the current location</li>
	<li>The form for adding a user is displayed in the modal window; All fields except 'id' are available for filling; 'Id' must be generated when saving</li>
	<li>Fields validation :
		<ul>
			<li>name -  required;</li>
			<li>username - required, unique;</li>
			<li>email - required, unique;</li>
			<li>phone - in the format '(xxx) xxx-xxxx';</li>
			<li>website - in the format '<website_name>. <Domain>';</li>
			<li>company.name - required, unique;</li>
		</ul></li>
</ul>
