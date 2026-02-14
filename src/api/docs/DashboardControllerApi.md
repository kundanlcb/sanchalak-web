# DashboardControllerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getActivityFeed**](#getactivityfeed) | **GET** /api/dashboard/activity-feed | |
|[**getDashboardStats**](#getdashboardstats) | **GET** /api/dashboard/stats | |
|[**getGenderDistribution**](#getgenderdistribution) | **GET** /api/dashboard/gender-distribution | |
|[**getTeacherPerformance**](#getteacherperformance) | **GET** /api/dashboard/teacher-performance | |

# **getActivityFeed**
> object getActivityFeed()


### Example

```typescript
import {
    DashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardControllerApi(configuration);

const { status, data } = await apiInstance.getActivityFeed();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **getDashboardStats**
> object getDashboardStats()


### Example

```typescript
import {
    DashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardControllerApi(configuration);

const { status, data } = await apiInstance.getDashboardStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **getGenderDistribution**
> object getGenderDistribution()


### Example

```typescript
import {
    DashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardControllerApi(configuration);

const { status, data } = await apiInstance.getGenderDistribution();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **getTeacherPerformance**
> object getTeacherPerformance()


### Example

```typescript
import {
    DashboardControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DashboardControllerApi(configuration);

const { status, data } = await apiInstance.getTeacherPerformance();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

