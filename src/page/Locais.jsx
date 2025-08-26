import React, { useState } from "react";
import CadastroLocal from "./CadastroLocal.jsx";
import MenuNavbar from "./menuNavegacao.jsx";

export default function Locais() {
  const [abrirFormulario, setAbrirFormulario] = useState(false);

  return (
    <div className="">
        <MenuNavbar />
      <h1 className="text-2xl font-bold mb-4">Locais de Coleta</h1>

      <button
        onClick={() => setAbrirFormulario(true)}
        className="bg-success text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
      >
        Cadastrar Local
      </button>

      {abrirFormulario && (
        <div className="mt-4 p-4 border rounded-lg shadow bg-gray-50">
          <CadastroLocal />
          <button
            onClick={() => setAbrirFormulario(false)}
            className="mt-2 text-red-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}


