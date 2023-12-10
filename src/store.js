import { configureStore } from '@reduxjs/toolkit'
import { listUserSlice } from './components/Admin/Users/UsersSlice'
import { listMediumSlice } from './components/ManageMedium/ManageMediumSlice'
import { listOneLinkSlice } from './components/ManageOnelink/ManageOnelinkSlice'
import { listSourceSlice } from './components/ManageSource/ManageSourceSlice'
import { qrCodeSlice } from './components/qrcode/QrCodeSlice'
import { listSourceMedumSlice } from './components/SourceMediumMapping/SourceMediumMappingSlice'
import { ManageSourceMediumSlice } from './components/ManageSourceMedium/ManageSourceMediumSlice'
import { utmSlice } from './components/utm/UtmSlice'
import { shortUrlSlice } from './components/shorturl/ShortUrlSlice'

export const store = configureStore({
  reducer: {
    utms:utmSlice.reducer,
    qrcode:qrCodeSlice.reducer,
    shorturl:shortUrlSlice.reducer,
    listonelinks:listOneLinkSlice.reducer,
    source:listSourceSlice.reducer,
    medium: listMediumSlice.reducer,
    source_medium_mapping:listSourceMedumSlice.reducer,
    users:listUserSlice.reducer,
    manage_source_medium:ManageSourceMediumSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})