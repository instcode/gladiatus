_Gladiatus Helper comes with 3 modules. This section details how to install them and start using immediately._

### Gladiatus Helper Extreme ###
  * Requirements
    1. Use Firefox browser.
    1. Greasemonkey extension installed.
  * Setup process
    1. Visit http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper/src/gm/
    1. Click on _GladiatusHelper.user.js_, Greasemonkey will catch this userscript and install it.
  * Running
    * Go back your gladiatus page, "overview" for example, refresh the page and enjoy.
    * In order to get auction timer runs properly, you should leave your gladiatus account online during the transition time from "Short" to "Very short" :-)

### Gladiatus Battle Simulator ###
_Normally, after you install the GladiatusHelper userscript, you can use our Gladiatus simulation at [Gladiatus-Helper](http://gladiatus-helper.appspot.com/) right away. However, if you wanna use your own simulator, read this part carefully._
  * Requirements
    1. Register a Google App Engine site. Let's say http://instcode.appspot.com/
    1. Install Python to your machine.
    1. Install Google App Engine SDK from your machine by following the instruction page from Google.
  * Setup process
    1. Check out the _GladiatusHelper_ module source code from http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper to your GladiatusHelper project folder.
    1. Open _app.yaml_ file and change the first line _application: gladiatus-helper_ to your own Google App site, e.g. _application: instcode_.
    1. From your GladiatusHelper project folder above, type the following command:
```
     appcfg.py update src/
```
    1. Continue following the instruction on screen and done!
  * Running
    * You don't have to run anything because Google App Engine does it for you automatically. However, you might want to check whether it works or not.. Hence, visit your site, e.g.: http://instcode.appspot.com/ and try simulating a battle :-)
    * You also have to modify a little bit in Gladiatus Helper Greasemonkey script to point the simulator URL to your site. This might be done by editing the function GladiatusHelper\_Arena.js#arenaSimulateFight.

### Gladiatus Bots ###
  * Requirements
    1. Python 2.x installed.
    1. Google App Engine SDK installed.
  * Setup process
    1. Check out the _GladiatusHelper_ module source code from http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper to your GladiatusHelper project folder.
    1. If your Google App Engine SDK & your Gladiatus project are not in PYTHONPATH, you should add one:
      * On Linux: export PYTHONPATH=/path/to/google\_appengine:/path/to/gladiatus-project:$PYTHONPATH
      * On Windows: add all the paths above to PYTHONPATH environment variable.
  * Running
    * Get ready to run by preparing a bot's account, e.g. login/password: instcode/ohmypassword ;-)
    * You might have several kind of Gladiatus bots, run the appropriate one. For example:
```
     python Attacker.py -s s1.gladiatus.vn -u attacker -p passwd -v instcode
     python TrainingBot.py -s s1.gladiatus.vn -u instcode -p ohmypassword -q 1
```


That's all.

Happy cheating! Goodluck! =))