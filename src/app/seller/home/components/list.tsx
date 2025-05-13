"use-client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { oficinasMock } from "../service/oficinas.mock";
import { ZButton } from "@/components/button/button";

export default function ListHome() {
  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <ZButton label="Criar usuário" icon="pi pi-plus" onClick={() => {}} />
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-4">
          <div className="card">ncjnd</div>
        </div>
        <div className="col-12 md:col-4">
          <div className="card">ncjnd</div>
        </div>
        <div className="col-12 md:col-4">
          <div className="card">ncjnd</div>
        </div>
        <div className="col-12 md:col-4">
          <div className="card">ncjnd</div>
        </div>
        <div className="col-12 md:col-4">
          <div className="card">ncjnd</div>
        </div>
      </div>
    </>
  );
}
