#!/usr/bin/env python

"""Use Google Geocode API to update Lat/Lon coords in a Google Sheet."""

import pandas as pd
import numpy as np
import geocoder
from shapely.geometry import Point
import re
import gspread
from oauth2client.service_account import ServiceAccountCredentials


GEOCODE_KEY = None


def api_key():
    with open("geocode_api.txt", "r") as f:
        return next(f).split("\n")[0]


def load_wks(keyfile):
    scope = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]
    credentials = ServiceAccountCredentials.from_json_keyfile_name(keyfile, scope)
    gc = gspread.authorize(credentials)
    wks = gc.open("Places Barcelona").sheet1

    vals = wks.get_all_values()
    df = pd.DataFrame(vals[1:], columns=vals[0])
    print(df.head(3))

    return wks, df


def get_coords(row, columns):
    location = ""
    for col in columns:
        location += " " + str(row[col])

    if not pd.isnull(location):
        g = geocoder.google(
            str(location) + " Barcelona", method="geocode", key=GEOCODE_KEY
        )
        if g.latlng is not None:
            return g.lat, g.lng

    return 0, 0


def update_df(df, columns=["Name", "Address", "Area"]):
    count = 0
    for index, row in df.iterrows():
        lat, lng = get_coords(row, columns)
        if lat and lng:
            df.loc[index, "Lat"] = lat
            df.loc[index, "Lng"] = lng
            count += 1
    print("Num updated:", count)

    return df


def update_sheet(wks, df):
    # insert the updated values into the Google Sheet
    last_row = len(df) + 1

    cell_list = wks.range(f"G2:G{last_row}")
    for idx, cell in enumerate(cell_list):
        cell.value = df.loc[idx, "Lat"]
    wks.update_cells(cell_list)

    cell_list = wks.range(f"H2:H{last_row}")
    for idx, cell in enumerate(cell_list):
        cell.value = df.loc[idx, "Lng"]
    wks.update_cells(cell_list)


if __name__ == "__main__":
    GEOCODE_KEY = api_key()
    wks, df = load_wks("gspread-access.json")
    df = update_df(df)
    print(df)
    # update_sheets(wks, df)
