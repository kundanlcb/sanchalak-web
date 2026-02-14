# StudentControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bulkImportStudents**](#bulkimportstudents) | **POST** /api/academics/students/bulk-import | |
|[**createStudent**](#createstudent) | **POST** /api/academics/students | |
|[**deleteStudent**](#deletestudent) | **DELETE** /api/academics/students/{id} | |
|[**getAllStudents**](#getallstudents) | **GET** /api/academics/students | |
|[**getStudentById**](#getstudentbyid) | **GET** /api/academics/students/{id} | |
|[**updateStudent**](#updatestudent) | **PUT** /api/academics/students/{id} | |

# **bulkImportStudents**
> string bulkImportStudents()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let file: File; // (default to undefined)

const { status, data } = await apiInstance.bulkImportStudents(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**string**

### Authorization

[bearer-jwt](../README.md#bearer-jwt)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createStudent**
> StudentResponse createStudent(studentRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let studentRequest: StudentRequest; //

const { status, data } = await apiInstance.createStudent(
    studentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentRequest** | **StudentRequest**|  | |


### Return type

**StudentResponse**

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

# **deleteStudent**
> deleteStudent()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteStudent(
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

# **getAllStudents**
> Array<StudentResponse> getAllStudents()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

const { status, data } = await apiInstance.getAllStudents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<StudentResponse>**

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

# **getStudentById**
> StudentResponse getStudentById()


### Example

```typescript
import {
    StudentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getStudentById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StudentResponse**

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

# **updateStudent**
> StudentResponse updateStudent(studentRequest)


### Example

```typescript
import {
    StudentControllerApi,
    Configuration,
    StudentRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentControllerApi(configuration);

let id: number; // (default to undefined)
let studentRequest: StudentRequest; //

const { status, data } = await apiInstance.updateStudent(
    id,
    studentRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentRequest** | **StudentRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**StudentResponse**

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

