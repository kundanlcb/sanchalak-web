# ProfileControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**generateHomeworkUploadUrl**](#generatehomeworkuploadurl) | **POST** /api/me/homework/{homeworkId}/upload-url | |
|[**getAttendanceHistory**](#getattendancehistory) | **GET** /api/me/attendance/history | |
|[**getAttendanceSummary**](#getattendancesummary) | **GET** /api/me/attendance/summary | |
|[**getCurrentUser**](#getcurrentuser) | **GET** /api/me | |
|[**getDashboard**](#getdashboard) | **GET** /api/me/home | |
|[**getFeeLedger**](#getfeeledger) | **GET** /api/me/fees/ledger | |
|[**getHomework**](#gethomework) | **GET** /api/me/homework | |
|[**getHomeworkSubmission**](#gethomeworksubmission) | **GET** /api/me/homework/{homeworkId}/submission | |
|[**getLinkedStudents**](#getlinkedstudents) | **GET** /api/me/students | |
|[**getResults**](#getresults) | **GET** /api/me/results | |
|[**getTimetable**](#gettimetable) | **GET** /api/me/timetable | |
|[**submitHomework**](#submithomework) | **POST** /api/me/homework/{homeworkId}/submit | |

# **generateHomeworkUploadUrl**
> ApiResultPresignedUrlDto generateHomeworkUploadUrl()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let homeworkId: number; // (default to undefined)
let fileName: string; // (default to undefined)
let contentType: string; // (default to undefined)

const { status, data } = await apiInstance.generateHomeworkUploadUrl(
    homeworkId,
    fileName,
    contentType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeworkId** | [**number**] |  | defaults to undefined|
| **fileName** | [**string**] |  | defaults to undefined|
| **contentType** | [**string**] |  | defaults to undefined|


### Return type

**ApiResultPresignedUrlDto**

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

# **getAttendanceHistory**
> ApiResultListAttendanceRecordDto getAttendanceHistory()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAttendanceHistory(
    studentId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ApiResultListAttendanceRecordDto**

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

# **getAttendanceSummary**
> ApiResultAttendanceSummaryDto getAttendanceSummary()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAttendanceSummary(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultAttendanceSummaryDto**

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

# **getCurrentUser**
> ApiResultUserProfileDto getCurrentUser()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

const { status, data } = await apiInstance.getCurrentUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResultUserProfileDto**

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

# **getDashboard**
> ApiResultDashboardDto getDashboard()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getDashboard(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultDashboardDto**

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

# **getFeeLedger**
> ApiResultStudentLedgerDto getFeeLedger()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getFeeLedger(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultStudentLedgerDto**

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

# **getHomework**
> ApiResultHomeworkListDto getHomework()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getHomework(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultHomeworkListDto**

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

# **getHomeworkSubmission**
> ApiResultHomeworkSubmissionDto getHomeworkSubmission()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let homeworkId: number; // (default to undefined)
let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getHomeworkSubmission(
    homeworkId,
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **homeworkId** | [**number**] |  | defaults to undefined|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultHomeworkSubmissionDto**

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

# **getLinkedStudents**
> ApiResultListLinkedStudentDto getLinkedStudents()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

const { status, data } = await apiInstance.getLinkedStudents();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResultListLinkedStudentDto**

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

# **getResults**
> ApiResultResultsDto getResults()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getResults(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultResultsDto**

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

# **getTimetable**
> ApiResultTimetableDto getTimetable()


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let studentId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getTimetable(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResultTimetableDto**

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

# **submitHomework**
> ApiResultHomeworkSubmissionDto submitHomework(submitHomeworkRequest)


### Example

```typescript
import {
    ProfileControllerApi,
    Configuration,
    SubmitHomeworkRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProfileControllerApi(configuration);

let homeworkId: number; // (default to undefined)
let submitHomeworkRequest: SubmitHomeworkRequest; //

const { status, data } = await apiInstance.submitHomework(
    homeworkId,
    submitHomeworkRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **submitHomeworkRequest** | **SubmitHomeworkRequest**|  | |
| **homeworkId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResultHomeworkSubmissionDto**

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

