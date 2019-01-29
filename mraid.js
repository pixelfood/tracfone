// # MRAID API
/* To build the documentation for this library run docco -o ../docs/ -c docco.css -t docco.jst mraid.js in this directory (assuming you have docco installed via npm). http://jashkenas.github.io/docco/ */
var mraid = (function (window, document, mraid) {
  'use strict';

  /* if mraid.getVersion is defined, mraid is already loaded */
  if (mraid.getVersion) {
    postMessage({ action: 'loaded' });
    return mraid;
  }

  var
    version = '2.0',
    state = 'loading',
    eventListeners = [],
    viewable = false,
    screenWidth,
    screenHeight,
    capabilities,
    expandProperties = {
      width: null,
      height: null,
      useCustomClose: false,
      isModal: true // MRAID 2.0 spec indicates this should always be true
    },
    orientationProperties = {
      allowOrientationChange: true,
      forceOrientation: 'none'
    },
    resizeProperties = {
      width: null,
      height: null,
      customClosePosition: 'top-right',
      offsetX: 0,
      offsetY: 0,
      allowOffscreen: true
    };

  function log(message) {
    if (window.console) window.console.log('MRAID: ' + message);
  }

  function dispatchReadyEvent() {
    log('dispatchReadyEvent');

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'ready') eventListeners[i].callback();
    }

  }

  function dispatchStateChangeEvent() {
    log('dispatchStateChangeEvent');

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'stateChange') eventListeners[i].callback(state);
    }

  }

  function dispatchViewableChangeEvent() {
    log('dispatchViewableChangeEvent');

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'viewableChange') eventListeners[i].callback(viewable);
    }

  }

  function dispatchErrorEvent(message, action) {
    log('dispatchErrorEvent, message=' + message + ', action=' + action);

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'error') eventListeners[i].callback(message, action);
    }

  }

  function dispatchSizeChangeEvent(width, height) {
    log('dispatchSizeChangeEvent');

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'sizeChange') eventListeners[i].callback(width, height);
    }

  }

  function dispatchPostbackEvent(postback) {
    log('dispatchPostbackEvent, postback=' + JSON.stringify(postback));

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'postback') eventListeners[i].callback(postback);
    }

  }

  function dispatchVideoEvent(event, data) {
    log('dispatchVideoEvent, event=' + event + ', data=' + JSON.stringify(data));

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'video') eventListeners[i].callback(event, data);
    }

  }

  function dispatchWindowResizeEvent(event, data){
    log('dispatchWindowResizeEvent, event=' + event + ', data=' + JSON.stringify(data));

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'windowResize') eventListeners[i].callback(event, data);
    }
  }

  function dispatchBrowserDidCloseEvent() {
    log('dispatchBrowserDidCloseEvent');

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (eventListeners[i].event === 'browserDidClose') eventListeners[i].callback();
    }

  }

  function changeState(newState) {
    log('changeState, state=' + newState);
    if (state === newState) return;
    state = newState;
    dispatchStateChangeEvent();
  }

  function searchToObject(search) {
    if (search.indexOf('?') === 0) search = search.replace('?', '');
    var pairs = search.substring(1).split("&"),
      obj = {},
      pair,
      i;

    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;

      pair = pairs[i].split("=");
      obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
    }

    return obj;
  }

  function handleMessage(e) {
    /* Some third-party MRAID ads render iframes and communicate via postMessage, so we need to ignore those. */
    if (document.referrer && document.referrer.indexOf(e.origin) !== 0) log('handleMessage, origins do not match: something weird may happen');

    log('handleMessage, message=' + e.data);

    var
      message = null,
      overrideStyles = null;

    try {
      message = JSON.parse(e.data);
    } catch(err) {
      log(err);
      return;
    }

    switch(message.messageType) {
      case 'configuration':
        capabilities = message.capabilities;
        mraid.params = searchToObject(message.params);
        mraid.configuration = message.configuration;
        mraid.quiz = message.quiz;
        mraid.previousStateData = message.previousStateData;
        mraid.saveStatePath = message.saveStatePath;
        mraid.player = message.player;
        mraid.platform = message.platform;
        mraid.membersLoginURL = message.membersLoginURL;
        mraid.facebookLoginURL = message.facebookLoginURL;
        mraid.facebookFeedCallbackURL = message.facebookFeedCallbackURL;
        mraid.parentURL = message.parentURL;
        mraid.adType = message.adType;
        mraid.transactionID = message.transactionID;
        mraid.currency = message.currency;
        mraid.userID = message.userID;
        mraid.backfillAd = message.backfillAd;
        mraid.applicationIconUrl = message.applicationIconUrl;
        mraid.profileImageUrl = message.profileImageUrl;
        mraid.adStatID = message.adStatID;
        mraid.adUnitID = message.adUnitID;
        mraid.campaignID = message.campaignID;
        mraid.campaignName = message.campaignName;
        mraid.configuration.awardPointsOnInstall = message.awardPointsOnInstall;
        mraid.adEndsAt = message.adEndsAt;
        mraid.challengeAds = message.challengeAds;
        mraid.skipAdUnitUrl = message.skipAdUnitUrl;
        mraid.levelUpPoints = message.levelUpPoints;
        mraid.levelUpUrl = message.levelUpUrl;
        mraid.levelUpLevel = message.levelUpLevel;
        mraid.origin = message.origin;
        mraid.desktop = message.desktop;
        mraid.levelUpLevel = message.levelUpLevel;
        mraid.isAboveAndroid5 = message.isAboveAndroid5;
        mraid.nextAdURL = message.nextAdURL;
        mraid.receiptUpload = message.receiptUpload;
        mraid.continueAdURL = message.continueAdURL;
        mraid.enableBonusScreen = message.enableBonusScreen;
        mraid.stateKey = message.stateKey;
        mraid.continuing = message.continuing;
        mraid.windowWidth = message.windowWidth;
        mraid.windowHeight = message.windowHeight;

        if (message.cssOverride){
          overrideStyles = document.createElement('style');
          overrideStyles.type = 'text/css';
          document.body.appendChild(overrideStyles);

          if (overrideStyles.styleSheet) {
            overrideStyles.styleSheet.cssText = message.cssOverride;
          } else {
            overrideStyles.innerHTML = message.cssOverride;
          }

        }

        mraidLoaded();
        mraidDisplayed();
        break;
      case 'containerReady':

        if (state === 'loading') {
          mraidLoaded();
          mraidDisplayed();
        }

        break;
      case 'postback':
        dispatchPostbackEvent(message.postback);
        break;
      case 'video':
        dispatchVideoEvent(message.event, message.data);
        break;
      case 'browserDidClose':
        dispatchBrowserDidCloseEvent();
        break;
      case 'error':
        break;
      case 'resize':
          mraid.windowHeight = message.message.height;
          mraid.windowWidth = message.message.width;
          dispatchWindowResizeEvent(message.event, message.message);
        break;
      default:
        log('handleMessage, no handler for message');
    }

  }

  function handleWindowResize() {
    dispatchSizeChangeEvent(window.innerWidth, window.innerHeight);
  }

  function postMessage(messageObject) {
    var message = JSON.stringify(messageObject);
    log('postMessage, message=' + message);
    window.parent.postMessage(message, '*');
  }

  function mraidLoaded() {
    log('mraidLoaded');
    changeState('default');
    dispatchReadyEvent();
  }

  function mraidDisplayed() {
    log('mraidDisplayed');
    viewable = true;
    dispatchViewableChangeEvent();
  }

  // ## mraid.getVersion() *string*
  // Returns the MRAID version this library supports.
  mraid.getVersion = function () {
    log('getVersion');
    return version;
  };

  mraid.openImagePicker = function (postback) {
    log('openImagePicker postback=' + JSON.stringify(postback));

    postMessage({
      action: 'openImagePicker',
      postback: postback
    });
  };

  // ## mraid.addEventListener(event, callback)
  // Bind a callback function to an MRAID event. Supported events:
  // + **ready** (called when MRAID API is loaded and ready)
  // + **error** (called when an MRAID function fails, returns error message)
  // + **stateChange** (called when MRAID ad changes state)
  // + **viewableChange** (called when MRAID ad becomes viewable)
  // + **sizeChange** (called when MRAID ad changes size)
  // + **postback** (called when MRAID API completes executing an asynchronous function, e.g. notifying the user)
  // + **video** (called when video playback events occur)
  // + **browserDidClose** (called when embedded browser closes)
  mraid.addEventListener = function (event, callback) {
    log('addEventListener, event=' + event);

    if (callback === undefined) {
      dispatchErrorEvent('No listener defined.', 'addEventListener');
      return;
    }

    if (typeof(callback) !== 'function') {
      dispatchErrorEvent('Listener is not a function.', 'addEventListener');
      return;
    }

    switch (event) {
      case 'ready':

        if (state !== 'loading') {
          callback();
          break;
        }
        
        /* falls through */
      case 'error':
      case 'stateChange':
      case 'viewableChange':
      case 'sizeChange':
      case 'postback':
      case 'video':
      case 'windowResize':
      case 'browserDidClose':
        eventListeners.push({
          event: event,
          callback: callback
        });
        break;
      default:
        dispatchErrorEvent('Unknown event.', 'addEventListener');
    }
  };

  // ## mraid.removeEventListener(event, callback)
  // Unbind a callback function from an MRAID event.
  mraid.removeEventListener = function (event, callback) {
    log('removeEventListener, event=' + event);
    var savedListeners = [];

    function match(event1, event2, callback1, callback2) {
      if (callback1 && callback2) return (event1 === event2 && callback1 === callback2);
      return event1 === event2;
    }

    for (var i = 0; i < eventListeners.length; i += 1) {
      if (!match(eventListeners[i].event, event, eventListeners[i].callback, callback)) savedListeners.push(eventListeners[i]);
    }

    eventListeners = savedListeners;
  };

  // ## mraid.getState() *string*
  // Returns the current state of the MRAID ad.
  mraid.getState = function () {
    log('getState');
    return state;
  };

  // ## mraid.getPlacementType() *string*
  // Returns placement type of MRAID ad. Currently the MRAID API only supports *interstitial* ads.
  mraid.getPlacementType = function () {
    log('getPlacementType');
    return 'interstitial';
  };

  // ## mraid.isViewable() *boolean*
  // Returns whether the MRAID ad is viewable or not.
  mraid.isViewable = function () {
    log('isViewable');
    return viewable;
  };

  // ## mraid.open(url)
  // Opens a URL in the embedded browser.
  mraid.open = function (url) {
    log('open, url=' + url);

    postMessage({
      action: 'openBrowser',
      url: url
    });

  };

  mraid.challengeCheckin = function(id) {
    postMessage({
      action: 'challengeCheckin',
      id: id
    });
  };



  // ##mraid.getEvent(data)
  // Takes object or event name string and returns any matches in the config
  mraid.getEvent = function(data) {
    var i;

    function eventsMatch(a, b) {
      if ((a.event !== undefined) && (a.event !== b.event)) return false;
      if ((a.link_type !== undefined) && (a.link_type !== b.link_type)) return false;
      if ((a.media_id !== undefined) && (a.media_id !== b.media_id)) return false;
      if ((a.ad_placement !== undefined) && (a.ad_placement !== b.ad_placement)) return false;
      if ((a.url !== undefined) && (a.url !== b.url)) return false;
      if ((a.award !== undefined) && (a.award !== b.award)) return false;
      if ((a.points !== undefined) && (a.points !== b.points)) return false;
      return true;
    }

    if (typeof(data) == 'object') {
      for (i = 0; i < mraid.configuration.events.length; i++){
        if (eventsMatch(data, mraid.configuration.events[i])) {
          return mraid.configuration.events[i];
        }
      }
    } else {
      for (i = 0; i < mraid.configuration.events.length; i++){
        if (mraid.configuration.events[i].event == data) {
          return mraid.configuration.events[i];
        }
      }
    }
  };

  // ## mraid.expand([url])
  // "Expand" the MRAID ad, optionally using a URL for the expanded content.
  // If a URL is provided, an iframe will be appended to the document with the URL as its source. Otherwise, the ad merely changes to *expanded* state.
  // Dispatches a *stateChange* event.
  mraid.expand = function (url) {
    log('expand, url=' + url);
    if (state === 'expanded') return;

    var
      div,
      iframe,
      timer,
      loadAttempts = 0,
      maxLoadAttempts = 3,
      properties;

    function loadURL() {
      iframe.src = '';
      iframe.src = url;
      loadAttempts += 1;

      timer = window.setTimeout(function () {
        if (loadAttempts < maxLoadAttempts) {
          loadURL();
        } else {
          error();
        }
      }, 10000);

    }

    function error() {
      div.removeChild(iframe);
      document.body.removeChild(div);
      iframe = null;
      div = null;
      dispatchErrorEvent(url + ' failed to load', 'expand');
      /*
        should also log an event to the server
      */
    }

    /*
      load the url in an iframe, default to full width/height unless specified via setExpandProperties
      listen for load event, if load event fails to fire within 30 seconds (3 attempts at 10 seconds each), discard the iframe, log an error, and dispatch an error event
    */
    if (url !== undefined) {
      div = document.createElement('div');
      div.style.width = expandProperties.width + 'px';
      div.style.height = expandProperties.height + 'px';
      div.style.overflow = 'hidden';
      div.style.position = 'absolute';
      document.body.appendChild(div);
      iframe = document.createElement('iframe');
      iframe.width = expandProperties.width + 'px';
      iframe.height = expandProperties.height + 'px';
      div.appendChild(iframe);
      iframe.onload = function () {
        window.clearTimeout(timer);
        changeState('expanded');
      };
      loadURL();
    } else {
      changeState('expanded');
    }

    mraid.useCustomClose(expandProperties.useCustomClose);
  };

  // ## mraid.getExpandProperties() *object*
  // Returns object containing the expand properties for the ad.
  mraid.getExpandProperties = function () {
    log('getExpandProperties');
    var maxSize = mraid.getMaxSize();
    expandProperties.width = expandProperties.width || maxSize.width;
    expandProperties.height = expandProperties.height || maxSize.height;
    return expandProperties;
  };

  // ## mraid.setExpandProperties(obj)
  // Sets the ad's expand properties.
  mraid.setExpandProperties = function (obj) {
    log('setExpandProperties, properties=' + JSON.stringify(obj));
    expandProperties.width = obj.width || expandProperties.width;
    expandProperties.height = obj.height || expandProperties.height;
    expandProperties.useCustomClose = obj.useCustomClose === undefined ? expandProperties.useCustomClose : obj.useCustomClose;
  };

  // ## mraid.getOrientationProperties() *object*
  // Returns object containing the orientation properties for the ad.
  mraid.getOrientationProperties = function () {
    log('getOrientationProperties');
    return orientationProperties;
  };

  // ## mraid.setOrientationProperties(obj)
  // Sets the ad's orientation properties.
  mraid.setOrientationProperties = function (obj) {
    log('setOrientationProperties, properties=' + JSON.stringify(obj));
    orientationProperties.allowOrientationChange = obj.allowOrientationChange === undefined ? orientationProperties.allowOrientationChange : obj.allowOrientationChange;
    orientationProperties.forceOrientation = obj.forceOrientation || orientationProperties.forceOrientation;
  };

  // ## mraid.close()
  // Sets the state of the ad from *default* to *hidden*, or from *expanded/resized* to *default*.
  // Dispatches *stateChange* event.
  mraid.close = function () {
    log('close');

    switch (state) {
      case 'default':
        changeState('hidden');
        break;
      case 'expanded':
      case 'resized':
        changeState('default');
    }

  };

  // ## mraid.useCustomClose(bool)
  // Sets the ad's expand properties to use a custom close button.
  mraid.useCustomClose = function (bool) {
    log('useCustomClose, value=' + bool);
    expandProperties.useCustomClose = bool;
  };

  // ## mraid.resize()
  // Changes state of ad to *expanded*.
  // Dispatches *stateChange* event.
  mraid.resize = function () {
    log('resize');

    if (state === 'expanded') {
      dispatchErrorEvent('Cannot call resize on expanded content.', 'resize');
      return;
    }

    dispatchSizeChangeEvent(resizeProperties.width, resizeProperties.height);
    changeState('resized');
  };

  // ## mraid.getResizeProperties() *object*
  // Returns object containing ad's resize properties.
  mraid.getResizeProperties = function () {
    log('getResizeProperties');
    var maxSize = mraid.getMaxSize();
    resizeProperties.width = resizeProperties.width || maxSize.width;
    resizeProperties.height = resizeProperties.height || maxSize.height;
    return resizeProperties;
  };

  // ## mraid.setResizeProperties(obj)
  // Sets ad's resize properties.
  mraid.setResizeProperties = function (obj) {
    log('eetResizeProperties, properties=' + JSON.stringify(obj));
    resizeProperties.width = obj.width || resizeProperties.width;
    resizeProperties.height = obj.height || resizeProperties.height;
    resizeProperties.offsetX = obj.offsetX || resizeProperties.offsetX;
    resizeProperties.offsetY = obj.offsetY || resizeProperties.offsetY;
    resizeProperties.allowOffscreen = obj.allowOffscreen === undefined ? resizeProperties.allowOffscreen : obj.allowOffscreen;
  };

  // ## mraid.getCurrentPosition() *object*
  // Returns object containing current position and dimensions:
  // ```
  // {
  //   x: Number,
  //   y: Number,
  //   width: Number,
  //   height: Number
  // }
  // ```
  // Currently just returns default position.
  mraid.getCurrentPosition = function () {
    log('getCurrentPosition');
    return mraid.getDefaultPosition();
  };

  // ## mraid.getMaxSize() *object*
  // Returns object containing maximum available width and height for ad:
  // ```
  // {
  //  width: Number,
  //  height: Number
  // }
  // ```
  mraid.getMaxSize = function () {
    log('getMaxSize');

    return {
      width: window.innerWidth || document.body.clientWidth,
      height: window.innerHeight || document.body.clientHeight
    };

  };

  // ## mraid.getDefaultPosition() *object*
  // Returns object containing default position and dimensions of ad:
  // ```
  // {
  //   x: Number,
  //   y: Number,
  //   width: Number,
  //   height: Number
  // }
  // ```
  mraid.getDefaultPosition = function () {
    log('getDefaultPosition');
    var maxSize = mraid.getMaxSize();

    return {
      x: 0,
      y: 0,
      width: maxSize.width,
      height: maxSize.height
    };

  };

  // ## mraid.getScreenSize() *object*
  // Returns object containing screen dimensions:
  // ```
  // {
  //   width: Number,
  //   height: Number
  // }
  // ```
  mraid.getScreenSize = function () {
    log('getScreenSize');

    var portrait = window.innerWidth < window.innerHeight;

    return {
      width: (portrait ? window.screen.width : window.screen.height),
      height: (portrait ? window.screen.height : window.screen.width)
    };

  };

  // ## mraid.supports(feature) *boolean*
  // Used to check support for MRAID features:
  // + **sms** (can this device send SMS messages)
  // + **tel** (can this device make phone calls)
  // + **calendar** (can this device save calendar events)
  // + **storePicture** (can this device save images)
  // + **inlineVideo** (can this device play HTML5 video inline)
  // + **playVideo** (can this device play video in the native player)
  mraid.supports = function (feature) {
    log('supports, feature=' + feature);

    switch (feature) {
      case 'sms':
        return !!capabilities.supports_sms;
      case 'tel':
        return true;
      case 'calendar':
        return !!capabilities.supports_calendar;
      case 'storePicture':
        return !!capabilities.supports_store_picture;
      case 'inlineVideo':
        return !!capabilities.supports_inline_video;
      case 'playVideo':
        return !!capabilities.supports_play_video;
      default:
        dispatchErrorEvent('Unknown feature.', 'supports');
    }

  };

  // ## mraid.storePicture(imageURL)
  // Used to store an image on the device.
  mraid.storePicture = function (imageURL) {
    log('storePicture, url=' + imageURL);

    if (!(mraid.supports('storePicture'))) {
      dispatchErrorEvent('This device does not support storing pictures.', 'storePicture');
      return;
    }

    postMessage({
      action: 'storePicture',
      imageURL: imageURL
    });

  };

  // ## mraid.createCalendarEvent(obj)
  // Used to store an event on the device's calendar. Event object should be of the format:
  // ```
  // {
  //   description: String,
  //   start: String (e.g. '2011-03-24T09:00-08:00'),
  //   end: String (e.g. '2011-03-24T10:00:00-08:00'),
  //   location: String
  //   summary: String
  // }
  // ```
  mraid.createCalendarEvent = function (obj) {
    log('createCalendarEvent, properties=' + JSON.stringify(obj));

    if (!(mraid.supports('calendar'))) {
      dispatchErrorEvent('This device does not support adding calendar events.', 'createCalendarEvent');
      return;
    }

    obj = obj || {};

    postMessage({
      action: 'createCalendarEvent',
      eventData: {
        title: obj.description,
        startDate: new Date(obj.start).getTime() * 0.001,
        endDate: new Date(obj.end).getTime() * 0.001,
        location: obj.location,
        notes: obj.summary
      }
    });

  };

  // ## mraid.playVideo(videoURL[, width, height])
  // Play a video in the native player.
  // Optional width and height parameters are for Android in-app playback only.
  mraid.playVideo = function (videoURL, width, height) {
    log('playVideo, url=' + videoURL);

    if (!capabilities.supports_play_video) {
      dispatchErrorEvent('This device does not support native video playback.', 'playVideo');
      return;
    }

    postMessage({
      action: 'playVideo',
      videoURL: videoURL,
      width: width,
      height: height
    });

  };

  // ## mraid.trackEvent(eventObject)
  // Track an ad event.
  // The ad event object should match an event defined in the ad configuration, e.g.
  // ```
  // {
  //   event: 'click',
  //   link_type: 'site',
  //   media_id: 'endframe'
  // }
  // ```
  // The event object must match an ad configuration event in all of the following fields:
  // * event
  // * link_type
  // * url
  // * media_id
  // * ad_placement
  // * award
  // Other fields (e.g. points) are not evaluated when matching.
  // If no match is found, the event will not be tracked.
  // Optionally, a postback object can be included in the event object. The postback will be returned with any response provided by the server.
  // ```
  // {
  //   event: 'click'
  //   postback: {
  //     postbackEvent: 'clicked'
  //   }
  // }
  // ```
  // The returned response will be included in the postback object's "response" value.
  mraid.trackEvent = function (eventObject) {
    log('trackEvent, properties=' + JSON.stringify(eventObject));

    postMessage({
      action: 'trackEvent',
      eventObject: eventObject
    });

  };

  // ## mraid.notify(message[, postback])
  // Send a notification message to the user. Optionally accepts a postback object.
  // Important! The postback object should not be a function, it should be an object containing a string which will be used in a following MRAID *postback* event.
  // For example:
  // ```
  // mraid.addEventListener('postback', function (e) {
  //   alert(e.postbackEvent);
  // });
  // mraid.notify('Hello, world!', { postbackEvent: 'goodbye' });
  // ```
  // This will display a "Hello, world!" notification to the user, and when the notification is complete it will display an alert saying "goodbye".
  mraid.notify = function (message, postback) {
    log('notify, message=' + message + ', postback=' + JSON.stringify(postback));

    postMessage({
      action: 'notify',
      message: message,
      postback: postback
    });

  };

  // ## mraid.awardPoints(points[, postback])
  // Award points to the user. Optionally accepts a postback object. Note that is for display purposes only, it does not actually add points to the user's account. Points are only added to a user's account through the tracking of events.
  // Important! The postback object should not be a function, it should be an object containing a string which will be used in a following MRAID *postback* event.
  // For example:
  // ```
  // mraid.addEventListener('postback', function (e) {
  //   alert(e.postbackEvent);
  // });
  // mraid.awardPoints(99, { postbackEvent: 'goodbye' });
  // ```
  // This will display a notification to the user, tick up the point balance in the header, and display an alert saying "goodbye" when complete.
  mraid.awardPoints = function (points, postback) {
    log('awardPoints, points=' + points + ', postback=' + postback);

    postMessage({
      action: 'awardPoints',
      points: points,
      postback: postback
    });

  };

  // ## mraid.getChallengeAds()
  // Return an array of objects with the tagCount field filled it
  mraid.getChallengeAds = function(){
    log('getChallengeAds');
    postMessage({
      action: 'getChallengeAds',
    });
  };

  // ## mraid.goToPortal([deepLink])
  // Redirect to the user portal, optionally passing a deep link.
  // Deep linking is currently not supported.
  mraid.goToPortal = function (deepLink) {
    log('goToPortal, deepLink=' + deepLink);

    postMessage({
      action: 'goToPortal'
    });

  };

  // ## mraid.get(url, postback)
  // Retrieve data from a given URL via AJAX GET request.
  // Will return the postback message along with the request response.
  mraid.get = function (url, postback) {
    log('get, url=' + url + ', postback = ', + postback);

    postMessage({
      action: 'ajax',
      method: 'GET',
      url: url,
      postback: postback
    });

  };

  // ## mraid.post(url, data, postback)
  // Send data to a given URL via AJAX POST request.
  // Will return the postback message along with the request response.
  mraid.post = function (url, data, postback) {
    log('post, url=' + url + ', data = ' + data + ', postback = ', + JSON.stringify(postback));

    postMessage({
      action: 'ajax',
      method: 'POST',
      url: url,
      data: data,
      postback: postback
    });

  };

  (mraid.preloadEvents || []).forEach(function (e) {
    mraid.addEventListener(e.event, e.callback);
  });

  window.addEventListener('message', handleMessage, false);
  window.addEventListener('resize', handleWindowResize, false);
  postMessage({ action: 'loaded' });
  return mraid;
})(window, document, (window.mraid || {}));
