import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/authContext";

import Papa from "papaparse";

interface ParsedRow {
  [key: string]: string;
}

export default function BulkUpload() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || []);
        setRows(results.data);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const promises = rows.map(async (row) => {
      const url = `http://localhost:4001/api/entries/create`;
  
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
          },
          body: JSON.stringify({ text: row["Content"] }),
        });
  
        if (!res.ok) throw new Error("Failed to save entry");
  
        return { success: true, row };
      } catch (err: any) {
        return { success: false, row, error: err.message };
      }
    });
  
    const results = await Promise.all(promises);
  
    // Summary toast or console
    const failures = results.filter((r) => !r.success);
    const successes = results.filter((r) => r.success);
  
    if (failures.length > 0) {
      toast({
        variant: "destructive",
        title: "Some entries failed",
        description: `${failures.length} out of ${rows.length} failed.`,
      });
    } else {
      toast({ title: "All entries created successfully" });
    }
  
    console.log("Upload results:", results);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button onClick={((e) => handleSubmit(e))}>Submit</button>

      {rows.length > 0 && (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="border border-gray-300 px-2 py-1">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {headers.map((header) => (
                  <td key={header} className="border border-gray-300 px-2 py-1">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}