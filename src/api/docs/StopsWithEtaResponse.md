# StopsWithEtaResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**routeId** | **number** |  | [optional] [default to undefined]
**routeName** | **string** |  | [optional] [default to undefined]
**vehicleId** | **number** |  | [optional] [default to undefined]
**vehicleNumber** | **string** |  | [optional] [default to undefined]
**hasLiveTracking** | **boolean** |  | [optional] [default to undefined]
**lastUpdateTime** | **string** |  | [optional] [default to undefined]
**stops** | [**Array&lt;StopEtaDto&gt;**](StopEtaDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StopsWithEtaResponse } from './api';

const instance: StopsWithEtaResponse = {
    routeId,
    routeName,
    vehicleId,
    vehicleNumber,
    hasLiveTracking,
    lastUpdateTime,
    stops,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
