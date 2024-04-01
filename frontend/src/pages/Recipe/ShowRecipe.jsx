import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

const ShowRecipe = () => {
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token == "undefined" || !token) {
      navigate("/login");
      enqueueSnackbar("Faça login para visualizar suas receitas", {
        variant: "warning",
      });
    }
  }, [token, navigate, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login");
          enqueueSnackbar("Faça login para ver a receita", {
            variant: "warning",
          });
        } else {
          setLoading(false);
          enqueueSnackbar("Erro ao ver a receita", { variant: "error" });
        }
      });
  }, [id, token, enqueueSnackbar, navigate]);

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <BackButton destination={`/recipes`} />
          <h1 className="text-3xl my-4">Veja sua receita</h1>
        </div>
        <div className="flex items-center justify-center">
          <Link to={`/recipes/${id}/ingredients`} className="flex items-center">
            <MdOutlineAddBox className="text-sky-800 text-4xl mr-2" />
            <h1>Adicione ingredientes</h1>
          </Link>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl p-4">
          <div className="my-2">
            <span className="text-xl font-semibold text-gray-600">Nome:</span>
            <span className="ml-2">{recipe?.name}</span>
          </div>
          <div className="my-2">
            <span className="text-xl font-semibold text-gray-600">
              Tempo de preparo:
            </span>
            <span className="ml-2">{recipe?.cook_time}</span>
          </div>
          <div className="my-2">
            <span className="text-xl font-semibold text-gray-600">
              Descrição:
            </span>
            <span className="ml-2">{recipe?.description}</span>
          </div>
          <div className="my-2">
            <span className="text-xl font-semibold text-gray-600">
              Ingredientes:
            </span>
            {recipe?.recipe_ingredients &&
            recipe.recipe_ingredients.length > 0 ? (
              <div className="ml-2">
                {recipe?.recipe_ingredients?.map(
                  (recipe_ingredient, index) => (
                    <div key={index}>
                      <div className=" p-2">
                        {recipe_ingredient.ingredient.name}
                        {recipe_ingredient.quantity}
                        {recipe_ingredient.measurement_unit.name}
                        <Link
                          to={`/recipes/${recipe.id}/ingredients/edit/${recipe_ingredient.id}`}
                        >
                          <AiOutlineEdit className="text-2xl text-yellow-600 hover:text-yellow-400" />
                        </Link>
                      </div>
                      <div>
                        <Link
                          to={`/recipes/${recipe.id}/ingredients/delete/${recipe_ingredient.id}`}
                        >
                          <MdOutlineDelete className="text-2xl text-red-600 hover:text-red-400" />
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <span> Essa receita não possui ingredientes </span>
            )}
          </div>
          <div className="my-2">
            <span className="text-xl font-semibold text-gray-600">
              Valor receita:
            </span>
            {recipe?.recipe_ingredients &&
            recipe.recipe_ingredients.length > 0 ? (
              <span className="ml-2">{recipe?.cost_recipe} Reais</span>
            ) : (
              <span> Essa receita não possui ingredientes </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowRecipe;
