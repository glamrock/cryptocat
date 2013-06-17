#Contributing to Cryptocat

##Coding style for contributions
All contributed code, written in JavaScript, must adhere to the following coding style:  
	1. Tabs are used for indentation, **not** spaces.  
	2. Lines are **not** ended with semicolons.  
	3. Use camel case for variables, filenames, and so on.  
	4. Please comment your code sufficiently.  
	5. Anonymous closures should be used wherever they are useful.  


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
* **Arturo Filasto**: Testing and feedback. 
* **Tom Lowenthal**: Testing and feedback.  
* **Fabio Pietrosanti**: Testing and feedback.  

###Multimedia
* **A.J. Korkidakis**: Promotional video.  
* **P.J. Onori**: Some of the icons.  
* **Rich Vreeland**: Audio notifications.  
  
**With warm thanks to a contributor who has asked to remain anonymous.**