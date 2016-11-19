// @flow

export type DistanceUnit = 'in' | 'ft' | 'yd' | 'm' | 'km' | 'mi'
export type AngleUnit = 'deg' | 'min' | 'sec' | 'grad' | 'mil'
export type InclinationUnit = AngleUnit | '%'

// just in case Flow someday supports some kind of pattern-matching facilities...
export type Distance = string
export type Azimuth = string
export type Inclination = string
export type Latitude = string
export type Longitude = string

export type Surveyor = {
  roles?: string | Array<string>,
  [key: any]: mixed,
}

export type Surveyors = {
  [name: string]: ?Surveyor
}

export type Direction = 'fs' | 'bs'

export type SplayShot = {
  dir?: Direction,
  dist?: Distance,
  azm?: Azimuth,
  inc?: Inclination,
  splayDepth?: Distance,
  [key: any]: mixed,
}

export type Station = {
  station: string,
  cave?: string,
  isEntrance?: boolean,
  isAboveGround?: boolean,
  depth?: Distance,
  lrud?: Array<Distance>,
  lrudAzm?: Azimuth,
  nsew?: Array<Distance>,
  splays?: Array<SplayShot>,
  [key: any]: mixed,
}

export type ShotMeasurement = {
  dir?: Direction,
  dist?: Distance,
  azm?: Azimuth,
  inc?: Inclination,
  [key: any]: mixed,
}

export type Shot = {
  excludeDist?: boolean,
  dist?: 'auto',
  measurements?: Array<ShotMeasurement>,
  [key: any]: mixed,
}

export type Survey = Array<Station | Shot>

export type Trip = {
  name?: string,
  date?: string,
  surveyors?: Surveyors,
  distUnit: DistanceUnit,
  angleUnit: AngleUnit,
  azmBacksightsCorrected: boolean,
  incBacksightsCorrected: boolean,
  declination?: Azimuth,
  azmFsUnit?: AngleUnit,
  azmBsUnit?: AngleUnit,
  incFsUnit?: InclinationUnit,
  incBsUnit?: InclinationUnit,
  distCorrection?: Distance,
  azmFsCorrection?: Azimuth,
  azmBsCorrection?: Azimuth,
  incFsCorrection?: Inclination,
  incBsCorrection?: Inclination,
  survey?: Survey,
  [key: any]: mixed,
}

export type FixedStation = {
  lat: Latitude,
  long: Longitude,
  elev: Distance,
  [key: any]: mixed,
}

export type FixedStations = {
  distUnit: DistanceUnit,
  ellipsoid: 'WGS84',
  datum: 'WGS84',
  stations?: {[stationName: string]: FixedStation},
  [key: any]: mixed,
}

export type Cave = {
  fixedStations?: Array<FixedStations>,
  trips?: Array<Trip>,
  [key: any]: mixed,
}

export type MetacaveData = {
  caves: {
    [caveName: string]: Cave,
  },
  [key: any]: mixed,
}