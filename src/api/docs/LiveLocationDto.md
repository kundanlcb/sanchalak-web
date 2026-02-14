# LiveLocationDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**vehicleId** | **number** |  | [optional] [default to undefined]
**vehicleNumber** | **string** |  | [optional] [default to undefined]
**routeId** | **number** |  | [optional] [default to undefined]
**routeName** | **string** |  | [optional] [default to undefined]
**latitude** | **number** |  | [optional] [default to undefined]
**longitude** | **number** |  | [optional] [default to undefined]
**speedKmh** | **number** |  | [optional] [default to undefined]
**heading** | **number** |  | [optional] [default to undefined]
**capturedAt** | **string** |  | [optional] [default to undefined]
**receivedAt** | **string** |  | [optional] [default to undefined]
**secondsSinceLastUpdate** | **number** |  | [optional] [default to undefined]
**stalenessMessage** | **string** |  | [optional] [default to undefined]
**accuracyMeters** | **number** |  | [optional] [default to undefined]
**currentTripId** | **number** |  | [optional] [default to undefined]
**tripStatus** | **string** |  | [optional] [default to undefined]
**stale** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { LiveLocationDto } from './api';

const instance: LiveLocationDto = {
    vehicleId,
    vehicleNumber,
    routeId,
    routeName,
    latitude,
    longitude,
    speedKmh,
    heading,
    capturedAt,
    receivedAt,
    secondsSinceLastUpdate,
    stalenessMessage,
    accuracyMeters,
    currentTripId,
    tripStatus,
    stale,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
