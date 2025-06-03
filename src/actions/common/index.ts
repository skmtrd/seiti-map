"use server";

import axios from "axios";

export const fetchUrl = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};
