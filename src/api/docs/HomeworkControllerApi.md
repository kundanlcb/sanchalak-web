# HomeworkControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createHomework**](#createhomework) | **POST** /api/homework | |
|[**deleteHomework**](#deletehomework) | **DELETE** /api/homework/{id} | |
|[**getAllHomework**](#getallhomework) | **GET** /api/homework | |
|[**updateHomework**](#updatehomework) | **PUT** /api/homework/{id} | |

# **createHomework**
> Homework createHomework(homeworkRequest)


### Example

```typescript
import {
    HomeworkControllerApi,
    Configuration,
    HomeworkRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeworkControllerApi(configuration);

let homeworkRequest: HomeworkRequest; //

const { status, data } = await apiInstance.createHomework(
    homeworkRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeworkRequest** | **HomeworkRequest**|  | |


### Return type

**Homework**

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

# **deleteHomework**
> deleteHomework()


### Example

```typescript
import {
    HomeworkControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeworkControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteHomework(
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

# **getAllHomework**
> Array<Homework> getAllHomework()


### Example

```typescript
import {
    HomeworkControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeworkControllerApi(configuration);

const { status, data } = await apiInstance.getAllHomework();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Homework>**

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

# **updateHomework**
> Homework updateHomework(homeworkRequest)


### Example

```typescript
import {
    HomeworkControllerApi,
    Configuration,
    HomeworkRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeworkControllerApi(configuration);

let id: number; // (default to undefined)
let homeworkRequest: HomeworkRequest; //

const { status, data } = await apiInstance.updateHomework(
    id,
    homeworkRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeworkRequest** | **HomeworkRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Homework**

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

