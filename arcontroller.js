// listen for window 'load' event
window.addEventListener('load', function() {
  // this will track whether our AR control panel is open
  let menu_open = false;

  window.awe.init({
    // usually, auto. detecting device works fine
    device_type: awe.AUTO_DETECT_DEVICE_TYPE,
    settings: {
      // uniq. id of element that will contain our AR experience
      container_id: 'container',
      // optional fps specification
      fps: 30,
      default_camera_position: { x:0, y:0, z:0 },
      // can set array of Three.js lights for scene, each w/ an id, type, and color
      default_lights: [{
        id: 'point_light',
        type: 'point',  // see https://threejs.org/docs/#Reference/Lights/Light
        color: 0xFFFFFF
      }]
    },
    // define behavior after initialization
    ready: function() {
      // define required browser capabilities
      awe.util.require([
        {
          // WARNING: only define capabilities needed, else can prevent app from working
          // in some browsers (eg. using compass pts. w/ 'gyro' capability will not work
          // in desktop browsers)
          capabilities: ['gum','webgl'],
          files: [
              // these files enable specific functionality for awe.js
            ['lib/awe-standard-dependencies.js', 'lib/awe-standard.js'],
            'lib/awe-standard-window_resized.js',
            'lib/awe-standard-object_clicked.js',
            'lib/awe-jsartoolkit-dependencies.js',
            'lib/awe.marker_ar.js'
          ],
          success: function() {
            // this is generally the first function you run to start displaying elements
            // and sets up the awe.js scene
            window.awe.setup_scene();

            // Points of Interest
            // All elements in awe.js are positioned within “Points of Interest” (POI).
            // These are specific points in the scene marked via coordinates that objects
            // can be positioned inside of. You can move POIs around within awe.js as well
            // as elements themselves
            awe.pois.add({id: 'marker', position: {x: 0, y: 0, z: 10000}, visible: false});  // note here we have POI initially not visible

            // Projections
            // elements added to POIs are called projections
            awe.projections.add({
              // id can be anything as long as consistent in code
              id: 'wormhole',
              // geometry refers to the projection's Three.js geometry options
              geometry: {shape: 'plane', height: 200, width: 200},
              // Note, all coordinate values here are in relation to the projection's POI
              position: {x: 0, y: 0, z: 0},
              rotation: {x: 90, z: 45},
              // defines the projection's Three.js material for the geometry mesh
              material: {
                type: 'phong',
                color: 0x000000
              } // a texture could also be included (eg. texture: {path: 'path/to/texture.png'})
            }, {poi_id: 'marker'});  // define the POI for this projection

            /*
            * In the demo, I add seven different boxes/cubes to the scene, each one is
            * 30 pixels high (geometry/y) and placed 31 pixels lower on the y axis so that it
            * is originally hidden by the wormhole. They’re all slightly different widths to
            * make them look a bit like a lightbulb.
            *
            * I move them a little bit back from the center of the wormhole via their x and z
            * coordinates but to be honest, it’d probably look fine remaining at 0 for those
            * too if -5 bugs you. I’ve got it rotated 45 degrees on the y axis so that it faces
            * at a nice angle on top of the wormhole.
            * */
            awe.projections.add({
              id: 'ar_button_one',
              geometry: {shape: 'cube', x: 60, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFF0000
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_two',
              geometry: {shape: 'cube', x: 60, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFF6600
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_three',
              geometry: {shape: 'cube', x: 110, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFFFF00
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_four',
              geometry: {shape: 'cube', x: 150, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFFFFFF
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_five',
              geometry: {shape: 'cube', x: 180, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0x00FF00
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_six',
              geometry: {shape: 'cube', x: 150, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0x0080FF
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_seven',
              geometry: {shape: 'cube', x: 100, y: 30, z: 5},
              rotation: {y: 45},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0x8000FF
              }
            }, {poi_id: 'marker'});

            // here we define our marker detection event
            // (passed as array to the events.add() function)
            awe.events.add([{
              id: 'ar_tracking_marker',
              // define the types of devices it is applicable to. This seems to be
              // the same in all awe.js examples so far in their repo, so I’ve left it
              // as is with PC and Android set to 1.
              device_types: {
                pc: 1,
                android: 1
              },

              // (un)register used to (remove)add this event listener watching for the marker
              register: function(handler) {
                window.addEventListener('ar_tracking_marker', handler, false);
              },

              unregister: function(handler) {
                window.removeEventListener('ar_tracking_marker', handler, false);
              },

              // event handler to run once marker spotted
              handler: function(event) {
                if (event.detail) {

                  // look for '64' marker and only run response if find it
                  if (event.detail['64']) {
                    // move the POI IDed as 'marker' to the physical marker and make visible
                    awe.pois.update({
                      data: {
                        visible: true,
                        position: {x: 0, y: 0, z: 0},
                        matrix: event.detail['64'].transform  // transform 'marker' POI to the ['64'] physical marker?
                      },
                      where: {
                        id: 'marker'
                      }
                    });

                    // set wormhole projection to be visible
                    awe.projections.update({
                      data: {
                        visible: true
                      },
                      where: {
                        id: 'wormhole'
                      }
                    });

                  // Else if we don’t see the marker but our menu is open, we’ll set it to
                  // remain open but hide the wormhole. The main reasoning for this is that
                  // with some of the light changes, the marker may become illegible, but we
                  // still want to see the menu
                  } else if (menu_open) {
                    awe.projections.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'wormhole'
                      }
                    });
                  }

                  // If there is no marker and our menu isn’t open, then the whole POI
                  // is hidden waiting for us to view it.
                  else {
                    awe.pois.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                  }
                  // request awe.js to update the scene
                  awe.scene_needs_rendering = 1;
                }
              }
            }]);

            // All click events are contained in the 'object_clicked' event
            window.addEventListener('object_clicked', function(e) {
              // Our click event contains the ID of the projection that was clicked
              // within e.detail.projection_id. We use a switch statement (based on the id)
              // to determine how to react to the click.
              switch (e.detail.projection_id) {
                case 'wormhole':
                  if (!menu_open) {
                    // open menu (if closed) by raising all of our menu elements
                    // up from 'under' the wormhole by their respective needed amounts

                    awe.projections.update({
                      data: {
                        animation: {
                          // set how long the animation should take to complete
                          duration: 1
                        },
                        // set position for this projection to move to
                        position: {y: 35}
                      },
                      where: {id: 'ar_button_one'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 70}
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 105}
                      },
                      where: {id: 'ar_button_three'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 140}
                      },
                      where: {id: 'ar_button_four'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 175}
                      },
                      where: {id: 'ar_button_five'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 210}
                      },
                      where: {id: 'ar_button_six'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: 245}
                      },
                      where: {id: 'ar_button_seven'}
                    });
                  } else {
                    // else, if menu already open, bring the menu component projection
                    // back 'under' the wormhole projection

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_one'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_three'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_four'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_five'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_six'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_seven'}
                    });
                  }

                  // switch menu state each time the menu is clicked
                  menu_open = !menu_open;

                break;
                case 'ar_button_one':
                case 'ar_button_two':
                case 'ar_button_three':
                case 'ar_button_four':
                case 'ar_button_five':
                case 'ar_button_six':
                case 'ar_button_seven':
                  // Within our button click event, we make a HTTP request to IFTTT which
                  // includes our button’s ID as the event name and our key to access the IFTTT
                  // service. We don’t really use the data that comes back, we log it to the
                  // console for debugging purposes but otherwise, the actual results come from
                  // IFTTT reacting to the HTTP call.
                  var request = new XMLHttpRequest();
                  //request.open(): method, url, async, user, password
                  request.open('GET', 'http://maker.ifttt.com/trigger/'+e.detail.projection_id+'/with/key/yourkeyhere', true);

                  request.onload = function() {
                    if (200 <= request.status && request.status < 400) {
                      var data = JSON.parse(request.responseText);
                      console.log(data);
                    }
                  };

                  request.send();
                break;
              }
            }, false);
          } // success()
        },
        {
          // After all of this, if awe.js does not load up because of incompatibilities
          // and so forth, we have an alternative script that loads to show an error message.
          capabilities: [],
          success: function() { 
            document.body.innerHTML = '<p>Try this demo in the latest version of Chrome or Firefox on a PC or Android device</p>';
          }
        }
      ]); // awe.util.require()
    } // ready()
  }); // window.awe.init()
}); // load