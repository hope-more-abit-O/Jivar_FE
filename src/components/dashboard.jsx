import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navigation from "./navigation/navigation";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Button } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Dashboard = ({ projectId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chartsData, setChartsData] = useState([]);
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleDownloadAndProcess = async () => {
        try {
            setLoading(true);
    
            const projectId = Cookies.get("projectId");
            const accessToken = Cookies.get("accessToken");
            if (!accessToken) {
                throw new Error("Access token is missing!");
            }
    
            const response = await axios.get(
                `http://localhost:5287/api/ExcelExport/export-projects/${projectId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    responseType: "blob", // Receive blob data
                }
            );
    
            // Save the file locally
            const contentDisposition = response.headers["content-disposition"];
            const fileName = contentDisposition
                ? contentDisposition.split("filename=")[1].replace(/"/g, "")
                : "download.xlsx";
    
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const fileUrl = window.URL.createObjectURL(blob);
    
            // Trigger file download
            const link = document.createElement("a");
            link.href = fileUrl;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Process the file for chart generation
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: "binary" });
                const sheetNames = workbook.SheetNames;
    
                const charts = sheetNames.map((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
    
                    const numericColumns = Object.keys(jsonData[0] || {}).filter(
                        (col) => typeof jsonData[0][col] === "number"
                    );
    
                    return {
                        sheetName,
                        data: numericColumns.map((col) => ({
                            label: col,
                            value: jsonData.reduce((sum, row) => sum + (row[col] || 0), 0),
                        })),
                    };
                });
    
                setChartsData(charts);
                setLoading(false);
            };
            fileReader.readAsBinaryString(response.data);
        } catch (err) {
            console.error("Error downloading or processing the file:", err);
            setError(err.message);
            setLoading(false);
        }
    };
    


    return (
        <div className="min-h-screen">
            <Navigation />
            <h1 className="mt-5 ml-5 text-2xl font-bold mb-6">Dashboard</h1>
            <div className="border-b border-gray-200 px-6 py-4">
                <Button
                    variant="text"
                    className="flex items-center text-[#42526E] hover:text-[#172B4D] normal-case px-0 text-base"
                    onClick={handleGoBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to previous page
                </Button>
            </div>
            <button
                onClick={handleDownloadAndProcess}
                className="bg-blue-500 mt-5 ml-5 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? "Processing..." : "Download and Generate Charts"}
            </button>

            {error && <div className="text-red-500 mt-4">Error: {error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 ml-5">
                {chartsData.map((chart, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4"
                        style={{ height: "300px" }}
                    >
                        <h2 className="text-lg font-bold mb-3 text-center">{chart.sheetName}</h2>
                        {chart.data.length > 0 ? (
                            <Bar
                                data={{
                                    labels: chart.data.map((item) => item.label),
                                    datasets: [
                                        {
                                            label: `Sum of Values`,
                                            data: chart.data.map((item) => item.value),
                                            backgroundColor: "rgba(75, 192, 192, 0.6)",
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        tooltip: {
                                            enabled: true,
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                    return `Value: ${tooltipItem.raw}`;
                                                },
                                            },
                                        },
                                        legend: {
                                            display: false,
                                        },
                                        title: {
                                            display: true,
                                            text: `Bar Chart for ${chart.sheetName}`,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            ticks: {
                                                maxTicksLimit: 5,
                                            },
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <p className="text-center text-gray-500">No numeric data to display for this sheet.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
