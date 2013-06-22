#Contributing to Cryptocat

##Coding style for contributions
Please be mindful that you are contributing to security and encryption software. We expect all code to be pre-reviewed for security and to be of high quality.  

All contributed code, written in JavaScript, must adhere to the following coding style:  
	1. Tabs are used for indentation, **not** spaces.  
	2. Lines are **not** ended with semicolons.  
	3. Use camel case for variables, filenames, and so on.  
	4. As a rule, use single quotes, (such as 'string'), not double quotes ("string").  
	5. As a rule, strict-type isEqual is preferred (1 **===** 1 instead of 1 **==** 1).  
	6. Please comment your code sufficiently.  
	7. Anonymous closures should be used wherever they are useful.  


##Contributing or improving translations
Please **do not send pull requests for translations**. Instead, use [Transifex](https://www.transifex.com/projects/p/Cryptocat/resource/cryptocat/). Notify a project manager for Cryptocat on Transifex in case you need assistance.

##Tests
* Run tests using `make tests`.
* Make sure your code conforms by running `make lint`.

##License
All contributed code will automatically be licensed under the [GNU Affero General Public License (AGPL3)](https://www.gnu.org/licenses/agpl-3.0.html).  
The full license text is included in `LICENSE.txt`.  

##Discussion & Blog
* [Issue tracker](https://github.com/cryptocat/cryptocat/issues)
* [Development Blog](https://blog.crypto.cat)  

##Contributors

###Team
* **Nadim Kobeissi**: Created Cryptocat. Responsible for project direction, most of the code, design, implementation.  
* **Arlo Breault**: OTR library maintainer, bug reporter, all-around helper.  
* **Daniel "koolfy" Faucon**: Documentation maintainer, bug reporter, catches all the CTR implementation bugs.  

###Contributors
* **Jacob Appelbaum**: Testing and feedback.  
* **Joseph Bonneau**: Testing and feedback.  
* **Griffin Boyce**: Testing and feedback.  
* **Dmitry Chestnykh**: Salsa20 CSPRNG implementation.  
* **David Dahl**: window.crypto.getRandomValues() implementation for Firefox.  
* **Arturo Filastò**: Testing and feedback. 
* **Frederic Jacobs**: Substantial contributions to Cryptocat for Mac.  
* **Tom Lowenthal**: Testing and feedback.  
* **Fabio Pietrosanti**: Testing and feedback.  

###Multimedia
* **A.J. Korkidakis**: Promotional video.  
* **P.J. Onori**: Some of the icons.  
* **Rich Vreeland**: Audio notifications.  
  
**With warm thanks to a contributor who has asked to remain anonymous.**