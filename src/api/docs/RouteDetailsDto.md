# RouteDetailsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**routeId** | **number** |  | [optional] [default to undefined]
**routeName** | **string** |  | [optional] [default to undefined]
**routeCode** | **string** |  | [optional] [default to undefined]
**routeType** | **string** |  | [optional] [default to undefined]
**estimatedDurationMinutes** | **number** |  | [optional] [default to undefined]
**distanceKm** | **number** |  | [optional] [default to undefined]
**vehicleInfo** | [**VehicleInfo**](VehicleInfo.md) |  | [optional] [default to undefined]
**assignedStop** | [**StopInfo**](StopInfo.md) |  | [optional] [default to undefined]
**stops** | [**Array&lt;StopInfo&gt;**](StopInfo.md) |  | [optional] [default to undefined]
**currentTrip** | [**TripInfo**](TripInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RouteDetailsDto } from './api';

const instance: RouteDetailsDto = {
    routeId,
    routeName,
    routeCode,
    routeType,
    estimatedDurationMinutes,
    distanceKm,
    vehicleInfo,
    assignedStop,
    stops,
    currentTrip,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
