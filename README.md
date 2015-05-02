# metacave
## One cave survey data format to rule them all

(In progress!)

Metacave is a JSON cave survey data format.  That means it's:
* Way easier to parse and interpret than any other formats out there
* More human-readable and futureproof
* Extensible!
  * You can add all the metadata you want to any shot, station, trip, or cave,
    and give it a nice structure
  * You can embed program-specific features in it, without ruining another
    program's ability to load the base survey data
* Easy to store in MongoDB

```
{
  "caves": {                                Required - this is where you define all            
                                            your survey measurements

    "Fisher Ridge": {                       Everything inside here is in Fisher Ridge cave

                                            If you connect to another cave, don't worry -
                                            we'll cover how to handle that below

      "trips": {

        "name": "Tricky Traverse",          Optional - a name for this trip
        
        "date": "1981-02-14T00:00Z",        Optional - the date of this trip, in ISO8601
                                            format
        
        "surveyors": {                      Optional - members of the survey team
          "Dan Crowl":   "sketch", 
          "Keith Ortiz": "frontsights", 
          "Chip Hopper": "backsights", 
          "Peter Quick": [
            "lead tape",                    You can specify multiple roles in an array
            "photos"                        
          ],
          "Larry Bean": null                Use null if you don't want to specify a role
        }

        "distUnit": "ft",                   Required - the default unit for all distances
                                            in this trip
                                            "ft": feet
                                            "m" : meters

        "angleUnit": "deg",                 Required - the default unit for all angles in
                                            this trip
                                            "deg" : degrees
                                            "grad": gradians
                                            "mil" : mils (1/6400 of a circle)

        "backsightsCorrected": false,       Required - true if backsights are corrected,
                                            false if not
        
        "azmFsUnit": "deg",                 Optional - overrides default unit for
                                            frontsight azimuths

        "azmBsUnit": "grad",                Optional - overrides default unit for
                                            backsight azimuths
        
        "incFsUnit": "%",                   Optional - overrides default unit for
                                            frontsight inclinations
                                            Inclinations may also be in this unit:
                                            "%": percent grade
        
        "incBsUnit": "mil",                 Optional - overrides default unit for
                                            backsight inclinations
        
        "distCorrection": 1.5,              Optional distance - correction added to the
                                            distances.  Doesn't apply to LRUD/NSEW
                                            Default unit: "distUnit"
        
        "azmFsCorrection": 1,               Optional angle - correction added to the
                                            frontsight azimuths
                                            Default unit: "azmFsUnit", then "angleUnit"

        "azmBsCorrection": [2, "deg"],      Optional angle - correction added to the
                                            backsight azimuths
                                            Default unit: "azmBsUnit", then "angleUnit"

                                            (Note above that you can override the default 
                                            unit of any quantity by entering an array with 
                                            the value and unit name)
        
        "incFsCorrection": 0,               Optional angle - correction added to the
                                            frontsight inclinations
                                            Default unit: "incFsUnit", then "angleUnit"
        
        "incBsCorrection": 0,               Optional angle - correction added to the
                                            backsight inclinations
                                            Default unit: "incFsUnit", then "angleUnit"
        
        "survey": [

          {                                 This is a station.  The survey must begin and
                                            end with stations and have a shot in between
                                            each pair of stations

            "station": "A1",                Optional - the station name.  If omitted,
                                            turns the surrounding shots into splay shots
                                            (and all other fields here will be ignored)

            "cave": "Mammoth Cave",         Optional - specifies this station is in
                                            a different cave, for connections.  Stations
                                            in different caves can have the same name, but
                                            will be considered distinct.
            
            "isEntrance": true,             Optional - true if the station is an entrance,
                                            false (or omitted) if not
            
            "lrud": [5, 4, 0, 2],           Optional distances - the LRUDs at this 
                                            station.  They will also be associated with
                                            the surrounding shots
                                            Default unit: "distUnit"
            
            "lrudAzm": 3,                   Optional angle or "prev" or "next" - 
                                            the facing angle of the LRUDs
                                            "prev" : perpendicular to previous shot
                                            "next" : perpendicular to next shot
                                            <angle>: the azimuth that is forward
                                                     (for instance, if you put the next
                                                     shot's azimuth, it will be 
                                                     perpendicular to the next shot)
                                            Default unit: "angleUnit"

            "nsew": [3, 2, 4, [6, "in"]]    Optional distances - the NSEWs at this
                                            station. They will also be associated with
                                            the surrounding shots.

                                            (Note that you can also put unit overrides in
                                            "lrud" and "nsew")
                                            "in": inches are only allowed in array
                                                  overrides
          },

          {                                 This is a shot from the previous station to
                                            the following station
            TODO! 
          }, 

          {                                 The survey must end with a station
            "station": "END"
          }
        ]
      }
    } 
  }
}
```
