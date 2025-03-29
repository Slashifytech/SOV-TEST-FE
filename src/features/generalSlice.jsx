import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  airTicketById,
  allAirTicket,
  countryInstituteOptions,
  countryOptions,
  courseData,
  getAllDocument,
  getAllTicket,
  getCountryStateData,
  getInstitutesData,
  getPopularCourseData,
  getStudentDataById,
  getVisaStatus,
  getWithdrawalData,
  prefferedCountry,
  recieveDocument,
} from "./generalApi";
import { resetStore } from "./action";


export const getCountryOption = createAsyncThunk(
  "general/getCountryOption",
  async (_, { rejectWithValue }) => {
    try {
      const res = await countryOptions();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getPrefCountryOption = createAsyncThunk(
  "general/getPrefCountryOption",
  async (_, { rejectWithValue }) => {
    try {
      const res = await prefferedCountry();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);

export const getInstituteOption = createAsyncThunk(
  "general/getInstituteOption",
  async (country, { rejectWithValue }) => {
    try {
      const res = await countryInstituteOptions(country);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getCourses = createAsyncThunk(
  "general/getCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await courseData();
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);

export const getPopularCourses = createAsyncThunk(
  "general/getPopularCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPopularCourseData();
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);

export const studentById = createAsyncThunk(
  "general/studentById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getStudentDataById(id);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const allTicket = createAsyncThunk(
  "general/allTicket",
  async (
    { page, perPage, isPriorityType, isStatusType, search, isDate },
    { rejectWithValue }
  ) => {
    try {
      const res = await getAllTicket(
        page,
        perPage,
        isPriorityType,
        isStatusType,
        search,
        isDate
      );
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const visaStatusData = createAsyncThunk(
  "general/visaStatusData",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getVisaStatus(id);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getDocumentAll = createAsyncThunk(
  "general/getDocumentAll",
  async ({ path, search, page, perPage }, { rejectWithValue }) => {
    try {
      const res = await getAllDocument(path, search, page, perPage);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getRecievedDocument = createAsyncThunk(
  "general/getRecievedDocument",
  async ({ studentId, page, perPage, search, isType }, { rejectWithValue }) => {
    try {
      const res = await recieveDocument(
        studentId,
        page,
        perPage,
        search,
        isType
      );
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const fetchAllAirTicket = createAsyncThunk(
  "general/fetchAllAirTicket",
  async ({ page, perPage, search, userId }, { rejectWithValue }) => {
    try {
      const res = await allAirTicket(page, perPage, search, userId);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const fetchAirTicketById = createAsyncThunk(
  "general/fetchAirTicketById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await airTicketById(id);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const withdrawalDataGet = createAsyncThunk(
  "general/withdrawalDataGet",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getWithdrawalData(userId);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const fetchInstituteData = createAsyncThunk(
  "general/fetchInstituteData",
  async (
    { page, perPage, courses, country, inTake, search, institute },
    { rejectWithValue }
  ) => {
    try {
      const res = await getInstitutesData(
        page,
        perPage,
        courses,
        country,
        inTake,
        search,
        institute
      );
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const fetchCountryState = createAsyncThunk(
  "general/fetchCountryState",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCountryStateData();
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country state"
      );
    }
  }
);
const initialState = {
  countryOption: [],
  prefCountryOption: [],
  instituteOption: [],
  courses: [],
  popularCourse: [],
  studentData: null,
  getAllTicket: [],
  visaStatus: [],
  getAllDocuments: [],
  recieveDocs: [],
  withdrawalData: "",
  airTickets: null,
  airTicketById: null,
  instituteData: null,
  countryState: [],
  status: "idle",
  error: null,
}
const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    // Add a reducer to remove a university optimistically (immediate UI update)
    removeShortlistedUniversity: (state, action) => {
      state.instituteOption = state.instituteOption.filter(
        (institute) => institute.id !== action.pay
      );
    },
    emptyAirTicket: (state) => {
      state.airTicketById = null;
    },
    emptyData: (state) => {
      state.instituteData = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCountryOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCountryOption.fulfilled, (state, action) => {
        state.countryOption = action.payload[0].allCountry;
        state.status = "succeeded";
      })
      .addCase(getCountryOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getInstituteOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getInstituteOption.fulfilled, (state, action) => {
        state.instituteOption = action.payload;
        state.status = "succeeded";
      })
      .addCase(getInstituteOption.rejected, (state, action) => {
        state.status = "failed";
        state.instituteOption = [];
        state.error = action.payload || action.error.message;
      })
      .addCase(getPrefCountryOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPrefCountryOption.fulfilled, (state, action) => {
        state.prefCountryOption = action.payload[0].preferredCountry;
        state.status = "succeeded";
      })
      .addCase(getPrefCountryOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.status = "succeeded";
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getPopularCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPopularCourses.fulfilled, (state, action) => {
        state.popularCourse = action.payload;
        state.status = "succeeded";
      })
      .addCase(getPopularCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(studentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(studentById.fulfilled, (state, action) => {
        state.studentData = action.payload;
        state.status = "succeeded";
      })
      .addCase(studentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(allTicket.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(allTicket.fulfilled, (state, action) => {
        state.getAllTicket = action.payload;
        state.status = "succeeded";
      })
      .addCase(allTicket.rejected, (state, action) => {
        state.status = "failed";
        state.getAllTicket = [];
        state.error = action.payload || action.error.message;
      })
      .addCase(visaStatusData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(visaStatusData.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
        state.status = "succeeded";
      })
      .addCase(visaStatusData.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || action.error.message;
        state.visaStatus = [];
      })
      .addCase(getDocumentAll.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDocumentAll.fulfilled, (state, action) => {
        state.getAllDocuments = action.payload;
        state.status = "succeeded";
      })
      .addCase(getDocumentAll.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || action.error.message;
        state.getAllDocuments = [];
      })
      .addCase(getRecievedDocument.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRecievedDocument.fulfilled, (state, action) => {
        state.recieveDocs = action.payload;
        state.status = "succeeded";
      })
      .addCase(getRecievedDocument.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || action.error.message;
        state.recieveDocs = [];
      })
      .addCase(withdrawalDataGet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(withdrawalDataGet.fulfilled, (state, action) => {
        state.withdrawalData = action.payload;
        state.status = "succeeded";
      })
      .addCase(withdrawalDataGet.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllAirTicket.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllAirTicket.fulfilled, (state, action) => {
        state.airTickets = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllAirTicket.rejected, (state, action) => {
        state.status = "failed";
        state.airTickets = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAirTicketById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAirTicketById.fulfilled, (state, action) => {
        state.airTicketById = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAirTicketById.rejected, (state, action) => {
        state.status = "failed";
        state.airTicketById = null;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchInstituteData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInstituteData.fulfilled, (state, action) => {
        state.instituteData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchInstituteData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.instituteData = [];
      })
      .addCase(fetchCountryState.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCountryState.fulfilled, (state, action) => {
        state.countryState = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCountryState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.countryState = [];
      })
      .addCase(resetStore, () => initialState); 
  },
});
export const { clearInstituteOption, emptyAirTicket, emptyData } =
  generalSlice.actions;
export default generalSlice.reducer;
