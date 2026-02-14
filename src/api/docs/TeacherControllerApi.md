# TeacherControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTeacher**](#createteacher) | **POST** /api/academics/teachers | |
|[**deleteTeacher**](#deleteteacher) | **DELETE** /api/academics/teachers/{id} | |
|[**getAllTeachers**](#getallteachers) | **GET** /api/academics/teachers | |
|[**getTeacherById**](#getteacherbyid) | **GET** /api/academics/teachers/{id} | |
|[**updateTeacher**](#updateteacher) | **PUT** /api/academics/teachers/{id} | |

# **createTeacher**
> TeacherResponse createTeacher(teacherRequest)


### Example

```typescript
import {
    TeacherControllerApi,
    Configuration,
    TeacherRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherControllerApi(configuration);

let teacherRequest: TeacherRequest; //

const { status, data } = await apiInstance.createTeacher(
    teacherRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teacherRequest** | **TeacherRequest**|  | |


### Return type

**TeacherResponse**

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

# **deleteTeacher**
> deleteTeacher()


### Example

```typescript
import {
    TeacherControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTeacher(
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

# **getAllTeachers**
> Array<TeacherResponse> getAllTeachers()


### Example

```typescript
import {
    TeacherControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherControllerApi(configuration);

const { status, data } = await apiInstance.getAllTeachers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TeacherResponse>**

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

# **getTeacherById**
> TeacherResponse getTeacherById()


### Example

```typescript
import {
    TeacherControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getTeacherById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**TeacherResponse**

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

# **updateTeacher**
> TeacherResponse updateTeacher(teacherRequest)


### Example

```typescript
import {
    TeacherControllerApi,
    Configuration,
    TeacherRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherControllerApi(configuration);

let id: number; // (default to undefined)
let teacherRequest: TeacherRequest; //

const { status, data } = await apiInstance.updateTeacher(
    id,
    teacherRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teacherRequest** | **TeacherRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**TeacherResponse**

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

