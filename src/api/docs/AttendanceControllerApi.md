# AttendanceControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getClassAttendanceSheet**](#getclassattendancesheet) | **GET** /api/attendance/class/{classId}/date/{date} | |
|[**getClassAttendanceStatistics**](#getclassattendancestatistics) | **GET** /api/attendance/class/{classId}/statistics | |
|[**getStudentAttendanceHistory**](#getstudentattendancehistory) | **GET** /api/attendance | |
|[**getStudentAttendanceSummary**](#getstudentattendancesummary) | **GET** /api/attendance/summary | |
|[**markAttendance**](#markattendance) | **POST** /api/attendance | |
|[**markBulkAttendance**](#markbulkattendance) | **POST** /api/attendance/bulk | |
|[**updateAttendance**](#updateattendance) | **PUT** /api/attendance/{id} | |

# **getClassAttendanceSheet**
> ClassAttendanceSheetDto getClassAttendanceSheet()


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let classId: number; // (default to undefined)
let date: string; // (default to undefined)

const { status, data } = await apiInstance.getClassAttendanceSheet(
    classId,
    date
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|
| **date** | [**string**] |  | defaults to undefined|


### Return type

**ClassAttendanceSheetDto**

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

# **getClassAttendanceStatistics**
> ClassAttendanceStatistics getClassAttendanceStatistics()


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let classId: number; // (default to undefined)
let startDate: string; // (default to undefined)
let endDate: string; // (default to undefined)

const { status, data } = await apiInstance.getClassAttendanceStatistics(
    classId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|
| **startDate** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] |  | defaults to undefined|


### Return type

**ClassAttendanceStatistics**

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

# **getStudentAttendanceHistory**
> Array<AttendanceRecordDto> getStudentAttendanceHistory()


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let studentId: number; // (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getStudentAttendanceHistory(
    studentId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<AttendanceRecordDto>**

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

# **getStudentAttendanceSummary**
> AttendanceSummaryDto getStudentAttendanceSummary()


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.getStudentAttendanceSummary(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**AttendanceSummaryDto**

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

# **markAttendance**
> AttendanceRecord markAttendance(markAttendanceRequest)


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration,
    MarkAttendanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let markAttendanceRequest: MarkAttendanceRequest; //

const { status, data } = await apiInstance.markAttendance(
    markAttendanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markAttendanceRequest** | **MarkAttendanceRequest**|  | |


### Return type

**AttendanceRecord**

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

# **markBulkAttendance**
> BulkMarkAttendanceResponse markBulkAttendance(bulkMarkAttendanceRequest)


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration,
    BulkMarkAttendanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let bulkMarkAttendanceRequest: BulkMarkAttendanceRequest; //

const { status, data } = await apiInstance.markBulkAttendance(
    bulkMarkAttendanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bulkMarkAttendanceRequest** | **BulkMarkAttendanceRequest**|  | |


### Return type

**BulkMarkAttendanceResponse**

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

# **updateAttendance**
> AttendanceRecordDto updateAttendance(updateAttendanceRequest)


### Example

```typescript
import {
    AttendanceControllerApi,
    Configuration,
    UpdateAttendanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendanceControllerApi(configuration);

let id: number; // (default to undefined)
let updateAttendanceRequest: UpdateAttendanceRequest; //

const { status, data } = await apiInstance.updateAttendance(
    id,
    updateAttendanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAttendanceRequest** | **UpdateAttendanceRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AttendanceRecordDto**

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

