# DashboardDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**attendanceSummary** | [**AttendanceSummary**](AttendanceSummary.md) |  | [optional] [default to undefined]
**homeworkSummary** | [**HomeworkSummary**](HomeworkSummary.md) |  | [optional] [default to undefined]
**nextExam** | [**UpcomingExam**](UpcomingExam.md) |  | [optional] [default to undefined]
**feesSummary** | [**FeesSummary**](FeesSummary.md) |  | [optional] [default to undefined]
**recentNotices** | [**Array&lt;RecentNotice&gt;**](RecentNotice.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DashboardDto } from './api';

const instance: DashboardDto = {
    attendanceSummary,
    homeworkSummary,
    nextExam,
    feesSummary,
    recentNotices,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
