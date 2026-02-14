# RoutineControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignSlot**](#assignslot) | **POST** /api/academics/routine | |
|[**clearSlot**](#clearslot) | **DELETE** /api/academics/routine/{id} | |
|[**getRoutine**](#getroutine) | **GET** /api/academics/routine | |

# **assignSlot**
> RoutineResponse assignSlot(routineRequest)


### Example

```typescript
import {
    RoutineControllerApi,
    Configuration,
    RoutineRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutineControllerApi(configuration);

let routineRequest: RoutineRequest; //

const { status, data } = await apiInstance.assignSlot(
    routineRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **routineRequest** | **RoutineRequest**|  | |


### Return type

**RoutineResponse**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **clearSlot**
> clearSlot()


### Example

```typescript
import {
    RoutineControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutineControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.clearSlot(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoutine**
> Array<RoutineResponse> getRoutine()


### Example

```typescript
import {
    RoutineControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutineControllerApi(configuration);

let classId: number; // (default to undefined)

const { status, data } = await apiInstance.getRoutine(
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|


### Return type

**Array<RoutineResponse>**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

