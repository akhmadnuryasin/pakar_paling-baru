import { useState, useEffect } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Diagnosa() {
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnoseResult, setDiagnoseResult] = useState(null);
  const [loadingDiagnose, setLoadingDiagnose] = useState(false);
  const [loadingDiagnosesData, setLoadingDiagnosesData] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/diagnose"
        );
        setDiagnoses(response.data);
        setLoadingDiagnosesData(false);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
        setLoadingDiagnosesData(false);
      }
    };

    fetchData();
  }, []);

  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleDiagnoseSelect = (diagnose) => {
    const isSelected = selectedDiagnoses.some(
      (selected) => selected.kode_gejala === diagnose.kode_gejala
    );

    if (!isSelected) {
      setSelectedDiagnoses((prevSelected) => [...prevSelected, diagnose]);
    } else {
      setSelectedDiagnoses((prevSelected) =>
        prevSelected.filter(
          (selected) => selected.kode_gejala !== diagnose.kode_gejala
        )
      );
    }
  };

  const handleDiagnoseSubmit = () => {
    setLoadingDiagnose(true);

    const selectedSymptoms = selectedDiagnoses.map((diagnose) => {
      return diagnose.kode_gejala;
    });

    const requestData = {
      symptoms: selectedSymptoms,
    };

    axios
      .post(
        "https://sistempakar-backendapp-ce3dc310e112.herokuapp.com/diagnose",
        requestData
      )
      .then((response) => {
        setDiagnoseResult(response.data);
        setLoadingDiagnose(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingDiagnose(false);
      });
  };

  const handleClear = () => {
    setSelectedDiagnoses([]);
    setDiagnoseResult(null);
  };

  return (
    <div className="px-8 pb-8 mx-auto text-black lg:pb-0 bg-background">
      <div className="grid h-full min-h-screen grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col max-h-screen py-8">
          <ScrollArea className="h-full px-4 overflow-y-auto text-white border rounded-lg border-accent bg-background">
            <FormProvider {...useForm()}>
              <form onSubmit={handleSubmit(onSubmit)} className="">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-accent hover:bg-transparent">
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Kode</TableHead>
                      <TableHead className="text-white">Gejala</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingDiagnosesData ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      diagnoses.map((diagnose, index) => (
                        <TableRow
                          key={index}
                          className="border-y border-accent hover:bg-transparent"
                        >
                          <TableCell className="p-2 pl-6">
                            <FormControl>
                              <label
                                htmlFor={`checkbox-${diagnose.kode_gejala}`}
                              >
                                <input
                                  id={`checkbox-${diagnose.kode_gejala}`}
                                  type="checkbox"
                                  checked={selectedDiagnoses.some(
                                    (selected) =>
                                      selected.kode_gejala ===
                                      diagnose.kode_gejala
                                  )}
                                  onChange={() =>
                                    handleDiagnoseSelect(diagnose)
                                  }
                                  className="border-white rounded"
                                />
                              </label>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormLabel className="font-normal">
                              {diagnose.kode_gejala}
                            </FormLabel>
                          </TableCell>
                          <TableCell>
                            <FormLabel className="font-normal">
                              {diagnose.gejala}
                            </FormLabel>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </form>
            </FormProvider>
          </ScrollArea>
          <div className="flex gap-1">
            <Button
              type="button"
              onClick={handleDiagnoseSubmit}
              className={`w-full mt-8 bg-accent hover:bg-accent active:bg-secondary ${
                loadingDiagnose ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingDiagnose}
            >
              {loadingDiagnose ? "Loading..." : "Diagnosa"}
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="mt-8 bg-accent hover:bg-accent active:bg-secondary"
            >
              Clear
            </Button>
          </div>
        </div>
        <div className="max-h-screen lg:py-8 lg:col-span-2">
          <ScrollArea className="w-full h-full text-white border rounded-lg border-accent bg-background min-h-32">
            {loadingDiagnose ? (
              <div className="flex items-center justify-center min-h-screen bg-background">
                Sedang melakukan diagnosa, harap tunggu...
              </div>
            ) : (
              diagnoseResult && (
                <>
                  {/* Tampilkan gejala yang digunakan */}
                  {diagnoseResult.gejala_user && (
                    <div className="p-4">
                      <p className="mb-4 font-bold">Gejala Yang Di Diagnosa</p>
                      <div className="flex flex-wrap gap-2">
                        {diagnoseResult.gejala_user.map((symptom, index) => {
                          // Ambil hanya bagian kode gejala (misal: "G02", "G05", "G11")
                          const gejalaCode = symptom.split(":")[0].trim();
                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="font-semibold text-white border-accent"
                            >
                              {gejalaCode}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tampilkan hasil */}
                  {diagnoseResult.hasil && (
                    <div className="p-4">
                      <p className="mb-4 font-bold">Hasil Diagnosa</p>
                      <ul>
                        {diagnoseResult.hasil.map((hasil, index) => (
                          <li key={index} className="mb-2">
                            {hasil}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
