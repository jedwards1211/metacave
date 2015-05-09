# metacave
## One cave survey data format to rule them all

**(In progress!)**

Metacave is a [JSON](http://json.org/) cave survey data format.  That means it's:
* Way easier to parse, interpret, or output than any other formats out there
* Primarily designed for programs to work with, but not that hard for humans
  to read and edit
* Extensible!
  * You can add all the metadata you want to any shot, station, trip, or cave,
    and give it a nice structure
  * You can embed program-specific features in it, without ruining another
    program's ability to load the base survey data
* Easy to store in MongoDB

Metacave will soon become the native format (with extensions) for 
[Breakout](http://helloandy.xyz/breakout) and probably also [Cavewhere](https://github.com/Cavewhere/cavewhere).

In addition, Andy (author of Breakout) has import/export for Walls `.srv` files nearly
finished, and will have import/export for Compass `.dat` files soon as well (a much easier
job than parsing `.srv` files!

## Specification
(go to [README.md source](README.md) to avoid horizontal scrolling)

### Distance Units

```
"in": inches
"ft": feet
"yd": yards
"m" : meters
"km": kilometers
"mi": miles
```

### Angle Units

```
"deg" : degrees
"min" : minutes  (1/60   degree)
"sec" : seconds  (1/60   minute)
"grad": gradians (1/400  circle)
"mil" : mils     (1/6400 circle)
```

### Additional Inclination Unit

```
"%"   : percent grade
```

### Structure

```
{
  "caves": {                                Required - this is where you define all            
                                            your survey measurements

    "Fisher Ridge": {                       Everything inside here is in Fisher Ridge cave

                                            If you connect to another cave, don't worry -
                                            we'll cover how to handle that below

      "fixedStations": [                    This is where you define fixed station
                                            locations.  You can fix all stations in the
                                            cave if you want to import/export calculated
                                            loop closures from another program

        {                                   This is a fixed station group, whose only
                                            purpose is to specify the default units

          "distUnit": "m",                  Required - the default unit for all distances
                                            in this fixed station group
                                            
          "ellipsoid": "WGS84",             Required - must be WGS84, but this field is
                                            required for the sake of making the data
                                            unambiguous to a reader who hasn't read this
                                            spec
          
          "datum": "WGS84",                 Required - must be WGS84, but this field is
                                            required for the sake of making the data
                                            unambiguous to a reader who hasn't read this
                                            spec

          "stations": {
            "A1": {                         This is the fixed position for station A1

                                            "lat"/"long" pair must be defined using the WGS84
                                            projection, specifically EPSG:4326.

              "lat": 34.2342,               Required angle - latitude
                                            positive: north of equator
                                            negative: south of equator
                                            units: decimal degrees

              "long": -56.2313,             Optional angle - longitude
                                            positive: east of prime meridian
                                            negative: west of prime meridian
                                            units: decimal degrees
  
              "elev": 345,                  Required distance - elevation
                                            positive: above sea level
                                            negative: below sea level
                                            Default unit: "distUnit"
                                            Units can be overridden using [value, "unit"] convension
                                            for example [345, "ft"]

            },
            "Q5": {                         This is the fixed position for station Q5
              ...
            },
            ...
          }
        },
        {                                   (Another fixed station group)
          ...
        },
        ...
      ],
      "trips": [
        {                                   This is the start of a trip

          "name": "Tricky Traverse",        Optional - a name for this trip
          
          "date": "1981-02-14T00:00Z",      Optional - the date of this trip, in ISO8601
                                            format
          
          "surveyors": {                    Optional - members of the survey team
            "Dan Crowl": {
              roles:"sketch"
            },
            "Chip Hopper": {
              roles:"frontsights"
            },
            "Keith Ortiz": {
              roles:"backsights"
            },
            "Peter Quick": {
              roles: [                      You can specify multiple roles in an array or scalar
                "lead tape",
                "photos"
              ]
            },
            "Larry Bean": null              Use null if you don't want to specify a role
          }

          "distUnit": "ft",                 Required - the default unit for all distances
                                            in this trip

          "angleUnit": "deg",               Required - the default unit for all angles in
                                            this trip
                                            Supported units:
                                            "deg" : degrees
                                            "grad": gradians
                                            "mil" : mils (1/6400 of a circle)

          "backsightsCorrected": false,     Required - true if backsights are corrected,
                                            false if not
          
          "azmFsUnit": "deg",               Optional - overrides default unit for
                                            frontsight azimuths

          "azmBsUnit": "grad",              Optional - overrides default unit for
                                            backsight azimuths
          
          "incFsUnit": "%",                 Optional - overrides default unit for
                                            frontsight inclinations
                                            Additional supported unit:
                                            "%": percent grade
          
          "incBsUnit": "mil",               Optional - overrides default unit for
                                            backsight inclinations
          
          "distCorrection": 1.5,            Optional distance - correction added to the
                                            distances.  Doesn't apply to LRUD/NSEW
                                            Default unit: "distUnit"
          
          "azmFsCorrection": 1,             Optional angle - correction added to the
                                            frontsight azimuths
                                            Default unit: "azmFsUnit", then "angleUnit"

          "azmBsCorrection": 2,             Optional angle - correction added to the
                                            backsight azimuths
                                            Default unit: "azmBsUnit", then "angleUnit"

          "incFsCorrection": 0,             Optional angle - correction added to the
                                            frontsight inclinations
                                            Default unit: "incFsUnit", then "angleUnit"
          
          "incBsCorrection": 0,             Optional angle - correction added to the
                                            backsight inclinations
                                            Default unit: "incFsUnit", then "angleUnit"
           "survey": [
            {                               This is a station.  The survey must begin and
                                            end with stations and have a shot in between
                                            each pair of stations
                                            Enter null where a station should be to turn
                                            the surrounding shots into splay shots

              "station": "A1",              Optional - the station name.  If omitted,
                                            turns the surrounding shots into splay shots
                                            (and all other fields here will be ignored)

              "cave": "Mammoth Cave",       Optional - specifies this station is in
                                            a different cave, for connections.  Stations
                                            in different caves can have the same name, but
                                            will be considered distinct
              
              "isEntrance": true,           Optional - true if the station is an entrance,
                                            false (or omitted) if not

              "isAboveGround": true,        Optional - true if the station is above 
                                            ground, false (or omitted) if not

              "depth": 4.25,                Optional distance - depth underwater for dive 
                                            surveys (must be positive)
                                            If two adjacent stations have depths,
                                            inclinations can be omitted from the shot
                                            connecting them
                                            Default unit: "distUnit"
              
              "lrud": [5, 4, 0, 2],         Optional distances - the LRUDs at this 
                                            station.  They will also be associated with
                                            the surrounding shots
                                            Default unit: "distUnit"
              
              "lrudAzm": 3,                 Optional angle - the azimuth that is forward
                                            relative to the LRUDs
                                            If omitted, the default is bisecting the
                                            previous and next shot azimuths
                                            (unless station is a dead end, then 
                                            perpendicular to shot)
                                            Default unit: "angleUnit"

              "nsew": [3, 2, 4, 6]          Optional distances - the NSEWs at this
                                            station. They will also be associated with
                                            the surrounding shots
                                            Default unit: "distUnit"
            },
            {                               This is a shot from the previous station to
                                            the following station
                                            Enter null where a shot should be to indicate
                                            there is not a shot between the surrounding
                                            stations (just like leaving a row of
                                            measurements blank in survey notes)

              "dist": 15.3                  Optional distance - the distance between the 
                                            surrounding stations
                                            If omitted, means there was no shot between 
                                            the surrounding stations (just like leaving
                                            a row of measurements blank in survey notes)
                                            Default unit: "distUnit"

              "dist": "auto"                Only allowed if the from and to station are 
                                            fixed and no azimuths or inclinations are 
                                            given; tells the program to draw passage 
                                            connecting the stations anyway

                                            At least one of "fsAzm" and "bsAzm" is
                                            required unless the shot is vertical

              "fsAzm": 204.5                Optional angle - the frontsight azimuth
                                            Default unit: "fsAzmUnit", then "angleUnit"

              "bsAzm": 22.5                 Optional angle - the backsight azimuth
                                            Default unit: "bsAzmUnit", then "angleUnit"

                                            At least one of "fsInc" and "bsInc" is
                                            required unless the from and to stations
                                            have "depth"s

              "fsInc": -5                   Optional angle - the frontsight inclination
                                            Default unit: "fsIncUnit", then "angleUnit"

              "bsInc": 6                    Optional angle or "up" or "down" - the
                                            backsight inclination
                                            Default unit: "bsIncUnit", then "angleUnit"

              "excludeDist": true           Optional - true if you want to exclude this
                                            shot's dist from the total length of the cave,
                                            false (or omitted) otherwise
            }, 
            ...
            {                               The survey must end with a station
              "station": "END"
            }
          ]
        }
      ]
    },
    "Mammoth Cave": {                       Everything inside here is for Mammoth Cave
      ...
    },
    ...
  }
}
```

### Splay shots

If the to station of a shot is null, or has no "station" property, the shot is considered
a splay shot.

Examples:

```
  "survey": [
    {"station": "A1"},
    {"dist": 55, "fsAzm": 23, "fsInc": 80}, This is a splay shot from A1
    {},                                     station placeholder
    {},                                     shot placeholder
    {"station": "A1"},
    {"dist": 45, "fsAzm": 32, "fsInc": 75}, Another splay shot from A1
    null,                                   station placeholder
    null,                                   shot placeholder
    {"station": "A2"},
    {"dist": 32, "fsAzm": 64, "fsInc": 32}, A splay shot from A2
    {"hello": "world},                      Because this station has no "station" property
                                            it's equivalent to null
  ]
```

Example JavaScript interpreting logic:

```javascript
for (var i = 0; i < survey.length - 2; i += 2) {
  var from = survey[i],
      shot = survey[i + 1],
      to   = survey[i + 2];

  if (shot && (shot.dist || shot.dist === 0)) {
    if (!from || !from.station) {
      throw new Error("missing from station");
    }
    if (to && to.station) {
      // handle as splay shot
    }
    else {
      // handle as regular shot
    }
  }
}
```

### Individual unit overrides

Anywhere (_anywhere_!) you put a quantity with default units, you can instead override the default unit
by entering an array like this:

```
  "dist": [4, "m"]                          distance is 4 meters even if "distUnit": "ft"

  "dist": [5, "ft", 7, "in"]                distance is 5 feet 7 inches

  "dist": [4, "in", 6, "ft", 2, "m"]        distance is 4 inches + 6 feet + 2 meters
                                            this is absurd, but programs will be simpler
                                            if they don't have to worry about weird order
                                            or combined unit systems

  "azmFsCorrection": [2, "grad"]            frontsight azimuth correction is 2 gradians

  "lat":  [23, "deg", 26, "min", 21, "sec"] 23° 26′ 21″ (the Tropic of Cancer)

  "lrud": [4, 5, 1, [5, "in"]]              left, right, and up are in default units,
                                            down is 5 inches
```

### Can I use [YAML](http://www.yaml.org/)?

Great question!  Metacave would certainly look nicer to non-programmers if it were in YAML, right?

Plus, associating metadata like passage and area names with arbitrary groups of stations can be done more efficiently using YAML references.

**So feel free to make your program support YAML!**

#### BUT

* Please don't use any YAML features that can't be converted to JSON
* Please for the love of god don't use it like this:
```
%YAML 1.2
---
!!map {
  ? !!str "sequence"
  : !!seq [ !!str "one", !!str "two" ],
  ? !!str "mapping"
  : !!map {
    ? !!str "sky" : !!str "blue",
    ? !!str "sea" : !!str "green",
  },
}
```
The authors of YAML really got carried away, didn't they?

### Embedding Metadata

You can add any additional properties you want to JSON objects (the things enclosed in `{ }`).

Programs can ignore additional properties if they want, or visualize them somehow, or allow you
to search for shots by metadata, etc.

At the extreme end, programs can embed highly program-specific data - for example Philip Schuhardt
and I are working on a way of embedding Cavewhere's scanned note warping data.

The beauty of JSON's flexibility is that other programs will still be able to read all of the core
survey data without conversion, even if they don't know how to interpret another program's specific data.

If two programs embed data that has almost the same format but not quite, they might confuse each other -
but this can be solved by making an import feature that only interprets the core survey data, and then
making the routine that interprets the program-specific data build off of that.

For example, in Fisher Ridge all trips are assigned a number, so we could note that like so:

```
  "trips": [
    {
      "number": 1,
      ...
    },
    {
      "number": 2,
      ...
    },
    ...
  ]
```

Or say you wanted to note water depth at each station:

```
  "survey": [
    {
      "station": "W1",
      "waterDepth": 2,
      ...
    },
    {
      "dist": 5,
      ...
    },
    {
      "station": W2",
      "waterDepth": 5,
      ...
    },
    ...
  ]
```
