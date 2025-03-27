import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditIngredient = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token == "undefined" || !token) {
      navigate("/login");
      enqueueSnackbar("Faça login para editar seus ingredientes", {
        variant: "warning",
      });
    }
  }, [token, enqueueSnackbar, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/measurement_units`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setUnits(response.data);
      }).catch(() => {
        setLoading(false);
      });
    }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/ingredients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setName(response.data.name);
        setQuantity(response.data.quantity);
        setBrand(response.data.brand);
        setSelectedCategory(response.data.category.id);
        setSelectedUnit(response.data.measurement_unit.id);
        setPrice(response.data.price);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para editar seu ingrediente', { variant: 'warning' });
        } else {
          setLoading(false);
        }
      });
  }, [id]);

  const handleEditIngredient = () => {
    const data = {
      name,
      quantity,
      brand,
      category_id: selectedCategory,
      measurement_unit_id: selectedUnit,
      price,
    };

    setLoading(true);
    axios
      .put(`${import.meta.env.VITE_API_URL}/ingredients/${id}`, data
      , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Ingrediente editado com sucesso", {
          variant: "success",
        });
        navigate("/ingredients");
      })
      .catch(() => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
      });
  };

  return (
    <div className="p-4">
      <BackButton destination={"/ingredients"} />
      <h1 className="text-3xl my-4">Editar um Ingrediente</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl p-4 ">
        <div className="my-4 space-y-4">
          <div>
            <label className="text-xl mr-4 text-gray-500">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-xl mr-4 text-gray-500">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-xl mr-4 text-gray-500">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select border border-gray-500 px-4 py-2 w-full"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xl mr-4 text-gray-500">
              Unidade de medida
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="form-select border border-gray-500 px-4 py-2 w-full"
            >
              <option value="">Selecione uma unidade de medida</option>
              {units.map((uom, index) => (
                <option key={index} value={uom.id}>
                  {uom.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xl mr-4 text-gray-500">Quantidade</label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="text-xl mr-4 text-gray-500">
              Preço (somente número){" "}
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border-2 border-gray-500 px-4 py-2 w-full"
            />
          </div>
        </div>
        <button className="p-2 bg-sky-300 my-4" onClick={handleEditIngredient}>
          Salvar
        </button>
      </div>
    </div>
  );
};

export default EditIngredient;
