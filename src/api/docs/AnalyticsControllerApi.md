# AnalyticsControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCollectionTrend**](#getcollectiontrend) | **GET** /api/analytics/finance/trend | |
|[**getFinancialSummary**](#getfinancialsummary) | **GET** /api/analytics/finance/summary | |
|[**getReportCardData**](#getreportcarddata) | **GET** /api/analytics/report-card/{studentId} | |

# **getCollectionTrend**
> Array<CollectionTrendDto> getCollectionTrend()


### Example

```typescript
import {
    AnalyticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsControllerApi(configuration);

let days: number; // (optional) (default to 30)

const { status, data } = await apiInstance.getCollectionTrend(
    days
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **days** | [**number**] |  | (optional) defaults to 30|


### Return type

**Array<CollectionTrendDto>**

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

# **getFinancialSummary**
> FinancialSummaryDto getFinancialSummary()


### Example

```typescript
import {
    AnalyticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsControllerApi(configuration);

const { status, data } = await apiInstance.getFinancialSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**FinancialSummaryDto**

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

# **getReportCardData**
> ReportCardDataDto getReportCardData()


### Example

```typescript
import {
    AnalyticsControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsControllerApi(configuration);

let studentId: number; // (default to undefined)
let termId: number; // (default to undefined)

const { status, data } = await apiInstance.getReportCardData(
    studentId,
    termId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|
| **termId** | [**number**] |  | defaults to undefined|


### Return type

**ReportCardDataDto**

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

