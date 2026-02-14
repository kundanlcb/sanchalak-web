# TransportTrackingApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLiveLocation**](#getlivelocation) | **GET** /api/transport/live | Get Live Bus Location|
|[**getMyRoute**](#getmyroute) | **GET** /api/transport/my-route | Get Assigned Route|
|[**getStopsWithEta**](#getstopswitheta) | **GET** /api/transport/stops | Get Stops with ETA|
|[**getTransportEvents**](#gettransportevents) | **GET** /api/transport/events | Get Pickup/Drop Events|
|[**ingestLocationPing**](#ingestlocationping) | **POST** /api/transport/location-pings | Ingest GPS Ping|

# **getLiveLocation**
> ApiResultLiveLocationDto getLiveLocation()

Returns the latest GPS ping for the vehicle on the specified route.

### Example

```typescript
import {
    TransportTrackingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransportTrackingApi(configuration);

let routeId: number; //Route ID to track (default to undefined)
let studentId: number; //ID of the student (Required for PARENT role) (optional) (default to undefined)

const { status, data } = await apiInstance.getLiveLocation(
    routeId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **routeId** | [**number**] | Route ID to track | defaults to undefined|
| **studentId** | [**number**] | ID of the student (Required for PARENT role) | (optional) defaults to undefined|


### Return type

**ApiResultLiveLocationDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Live location returned |  -  |
|**404** | Vehicle/Route/Ping not found |  -  |
|**403** | User/Student not assigned to this route |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyRoute**
> ApiResultRouteDetailsDto getMyRoute()

Returns the transport route, vehicle, and stop assigned to the student. Parents must provide studentId.

### Example

```typescript
import {
    TransportTrackingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransportTrackingApi(configuration);

let studentId: number; //ID of the student (Required for PARENT role) (optional) (default to undefined)

const { status, data } = await apiInstance.getMyRoute(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] | ID of the student (Required for PARENT role) | (optional) defaults to undefined|


### Return type

**ApiResultRouteDetailsDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | No active transport assignment |  -  |
|**200** | Route details returned |  -  |
|**403** | Forbidden (Linkage validation failed) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStopsWithEta**
> ApiResultStopsWithEtaResponse getStopsWithEta()

Returns ordered list of stops with estimated arrival times based on current bus location.

### Example

```typescript
import {
    TransportTrackingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransportTrackingApi(configuration);

let routeId: number; //Route ID to track (default to undefined)
let studentId: number; //ID of the student (Required for PARENT role) (optional) (default to undefined)

const { status, data } = await apiInstance.getStopsWithEta(
    routeId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **routeId** | [**number**] | Route ID to track | defaults to undefined|
| **studentId** | [**number**] | ID of the student (Required for PARENT role) | (optional) defaults to undefined|


### Return type

**ApiResultStopsWithEtaResponse**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Stops with ETA returned |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTransportEvents**
> ApiResultListTransportEventDto getTransportEvents()

Returns history of boarding/alighting events for the student.

### Example

```typescript
import {
    TransportTrackingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TransportTrackingApi(configuration);

let studentId: number; //ID of the student (Required for PARENT role) (optional) (default to undefined)
let date: string; //Date (YYYY-MM-DD) (optional) (default to undefined)

const { status, data } = await apiInstance.getTransportEvents(
    studentId,
    date
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] | ID of the student (Required for PARENT role) | (optional) defaults to undefined|
| **date** | [**string**] | Date (YYYY-MM-DD) | (optional) defaults to undefined|


### Return type

**ApiResultListTransportEventDto**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Events list returned |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **ingestLocationPing**
> ApiResultString ingestLocationPing(locationPingDto)

Receives location updates from GPS hardware.

### Example

```typescript
import {
    TransportTrackingApi,
    Configuration,
    LocationPingDto
} from './api';

const configuration = new Configuration();
const apiInstance = new TransportTrackingApi(configuration);

let xDeviceAPIKey: string; //Device API Key (default to undefined)
let locationPingDto: LocationPingDto; //

const { status, data } = await apiInstance.ingestLocationPing(
    xDeviceAPIKey,
    locationPingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **locationPingDto** | **LocationPingDto**|  | |
| **xDeviceAPIKey** | [**string**] | Device API Key | defaults to undefined|


### Return type

**ApiResultString**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ping recorded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

