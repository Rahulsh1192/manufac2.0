import React, { useState, useEffect } from "react";
import { helpers } from "../../utils";
import Table from "../commonComponents/Table";
import styles from "./wine.module.css";
import axios from "axios";

const WineStats = () => {
  const [data, setData] = useState([]);
  const [gammaData, setGammaData] = useState([]);

  /* Define the grouping function which group the whole data as per class Alcohol */

  function grouping(result, current) {
    debugger;
    const categary = current.Alcohol;
    if (!(categary in result)) {
      result[categary] = [];
    }
    result[categary].push({
      ...current,
      gamma: helpers.calculateGamma(current),
    });
    return result;
  }

  const results = {};
  const gammaResult = {};

  async function fetchData() {
    debugger;
    try {
      // Assuming the file is in the public folder we can replace this with http request
      const response = await axios.get("/data.json");

      const data = response.data.data.reduce(grouping, {});

      for (const key in data) {
        /* MAKE THE DATA FOR THE FLAVANOIDS */
        results[key] = {
          mean: helpers.calculateMean(data[key], "Flavanoids"),
          median: helpers.calculateMedian(data[key], "Flavanoids"),
          mode: helpers.calculateMode(data[key], "Flavanoids"),
        };
        /* MAKE THE DATA FOR THE GAMMA */

        gammaResult[key] = {
          mean: helpers.calculateMean(data[key], "gamma"),
          median: helpers.calculateMedian(data[key], "gamma"),
          mode: helpers.calculateMode(data[key], "gamma"),
        };
      }
      setData(results);
      setGammaData(gammaResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table
        header={Object.keys(data)}
        data={Object.entries(data)}
        dataName="Flavanoids"
      />
      <Table
        header={Object.keys(gammaData)}
        data={Object.entries(gammaData)}
        dataName="Gamma"
      />
    </div>
  );
};

export default WineStats;
