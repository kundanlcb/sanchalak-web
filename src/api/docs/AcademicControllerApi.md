# AcademicControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**assignSubjectToClass**](#assignsubjecttoclass) | **POST** /api/academic/class-subjects | |
|[**createSubject**](#createsubject) | **POST** /api/academic/subjects | |
|[**createTerm**](#createterm) | **POST** /api/academic/terms | |
|[**deleteClass**](#deleteclass) | **DELETE** /api/academic/classes/{id} | |
|[**deleteSubject**](#deletesubject) | **DELETE** /api/academic/subjects/{id} | |
|[**getAllSubjects**](#getallsubjects) | **GET** /api/academic/subjects | |
|[**getAllTerms**](#getallterms) | **GET** /api/academic/terms | |
|[**getMarksForClass**](#getmarksforclass) | **GET** /api/academic/marks/class/{classId} | |
|[**getReportCard**](#getreportcard) | **GET** /api/academic/reports/{studentId} | |
|[**saveStudentMarks**](#savestudentmarks) | **POST** /api/academic/marks | |
|[**scheduleExam**](#scheduleexam) | **POST** /api/academic/schedules | |
|[**updateClass**](#updateclass) | **PUT** /api/academic/classes/{id} | |
|[**updateSubject**](#updatesubject) | **PUT** /api/academic/subjects/{id} | |

# **assignSubjectToClass**
> ClassSubject assignSubjectToClass(classSubjectRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    ClassSubjectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let classSubjectRequest: ClassSubjectRequest; //

const { status, data } = await apiInstance.assignSubjectToClass(
    classSubjectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classSubjectRequest** | **ClassSubjectRequest**|  | |


### Return type

**ClassSubject**

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

# **createSubject**
> Subject createSubject(subjectRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    SubjectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let subjectRequest: SubjectRequest; //

const { status, data } = await apiInstance.createSubject(
    subjectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectRequest** | **SubjectRequest**|  | |


### Return type

**Subject**

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

# **createTerm**
> ExamTerm createTerm(examTermRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    ExamTermRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let examTermRequest: ExamTermRequest; //

const { status, data } = await apiInstance.createTerm(
    examTermRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **examTermRequest** | **ExamTermRequest**|  | |


### Return type

**ExamTerm**

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

# **deleteClass**
> deleteClass()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteClass(
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

# **deleteSubject**
> deleteSubject()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteSubject(
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

# **getAllSubjects**
> Array<Subject> getAllSubjects()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

const { status, data } = await apiInstance.getAllSubjects();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Subject>**

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

# **getAllTerms**
> Array<ExamTerm> getAllTerms()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

const { status, data } = await apiInstance.getAllTerms();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ExamTerm>**

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

# **getMarksForClass**
> Array<ReportCardDto> getMarksForClass()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let classId: number; // (default to undefined)
let termId: number; // (default to undefined)

const { status, data } = await apiInstance.getMarksForClass(
    classId,
    termId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|
| **termId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ReportCardDto>**

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

# **getReportCard**
> ReportCardDto getReportCard()


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.getReportCard(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**ReportCardDto**

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

# **saveStudentMarks**
> StudentMarks saveStudentMarks(markEntryRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    MarkEntryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let markEntryRequest: MarkEntryRequest; //

const { status, data } = await apiInstance.saveStudentMarks(
    markEntryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **markEntryRequest** | **MarkEntryRequest**|  | |


### Return type

**StudentMarks**

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

# **scheduleExam**
> ExamSchedule scheduleExam(examScheduleRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    ExamScheduleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let examScheduleRequest: ExamScheduleRequest; //

const { status, data } = await apiInstance.scheduleExam(
    examScheduleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **examScheduleRequest** | **ExamScheduleRequest**|  | |


### Return type

**ExamSchedule**

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

# **updateClass**
> SchoolClass updateClass(requestBody)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let id: number; // (default to undefined)
let requestBody: { [key: string]: string; }; //

const { status, data } = await apiInstance.updateClass(
    id,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: string; }**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**SchoolClass**

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

# **updateSubject**
> Subject updateSubject(subjectRequest)


### Example

```typescript
import {
    AcademicControllerApi,
    Configuration,
    SubjectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AcademicControllerApi(configuration);

let id: number; // (default to undefined)
let subjectRequest: SubjectRequest; //

const { status, data } = await apiInstance.updateSubject(
    id,
    subjectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectRequest** | **SubjectRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Subject**

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

