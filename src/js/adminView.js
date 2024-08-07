//  Importo el URLbase para no hacer tan largas las URLS y poder cambiar desde solo una parte la URL
import { URLbase } from './app.js';

// Funcion asincronica para hacer la peticion y traer la informacion que rellena la grafica
const tbody1 = document.querySelector("#lastRequests")
const tbody2 = document.querySelector("#tbAllRequests")

//
//  Eventos
//

//  Llamo la funcion para obtener las solicitudes. 
getRequests()
// Llamo la funcion para cargar la grafica inmediatamente.
getDataMonths();

//
//  Funciones
//

//  Funcion que carga la informacion de la grafica.
async function getDataMonths() {
    const response = await fetch(URLbase+`request/last-five-months`);
    const data = await response.json();

    // Define el orden de los meses
    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Ordena la data según el orden de los meses
    data.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    // Extrae de la data y mapea la información agrupando por los valores que necesitas
    const totalRequests = data.map(item => item.totalRequests);
    const months = data.map(item => item.month);

    // Update the chart options
    const options = {
        chart: {
            height: "80%",
            maxWidth: "100%",
            type: "area",
            fontFamily: "Ubuntu, sans-serif",
            dropShadow: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: false,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#B6F04A",
                gradientToColors: ["#2CCC5B"],
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 6,
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: 0
            },
        },
        series: [
            {
                name: "Total Requests",
                data: totalRequests,
                color: "#2CCC5B",
            },
        ],
        xaxis: {
            categories: months,
            labels: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
        },
    };

    // Render the chart
    if (document.getElementById("area-chart") && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(document.getElementById("area-chart"), options);
        chart.render();
    }

    return data;
}

// Funcion que obtiene las solicitudes y llama las funciones de renderización.
async function getRequests() {
    const response = await fetch(URLbase+`request`);
    const data = await response.json();
    
    console.log(data);
    renderLastRequests(data.content);
    renderAllRequests(data.content);
} 
//  Funcion para renderizar las ultimas 5 solicitudes.
function renderLastRequests(requests) {
    cleanTbody(tbody1);

    requests.slice(0, 5).forEach((request) => {
        tbody1.innerHTML += `
            <tr class="bg-gray-900 border-b border-gray-800 hover:bg-gray-800">
                <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-normal break-words dark:text-white">
                    <img class="w-10 h-10 rounded-full" src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1223.jpg"> <!-- Reemplaza con la ruta correcta si tienes imágenes de avatar -->
                    <div class="ps-3">
                        <div class="text-base font-semibold">${request.user.userName}</div>
                        <div class="font-normal text-gray-500">${request.description}</div>
                    </div>
                </th>
                <td class="px-6 py-4">${new Date(request.dateTime).toLocaleString()}</td>
                <td class="px-6 py-4">
                    <button data-modal-toggle="admin-modal-${request.id}" data-modal-target="admin-modal-${request.id}" class="font-medium text-green-500 hover:underline">Admin</button>
                </td>
            </tr>

            <!-- Main modal -->
            <div id="admin-modal-${request.id}" tabindex="-1" aria-hidden="true"
                class="bg-gray-600/10 mt-16 hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-[calc(100%-1rem)] max-h-[90vh]">
                <div class="relative p-4 w-full max-w-4xl max-h-full h-full">
                    <!-- Modal content -->
                    <div class="relative bg-gray-900 rounded-lg shadow flex h-[80vh] items-stretch">
                        <!-- Left side content -->
                        <div class="w-1/2 p-4 md:p-5 border-r border-gray-600 flex flex-col gap-y-7 overflow-hidden mt-4">
                            <h1 class="text-3xl font-semibold text-white ml-7">Request Details</h1>
                            <p class="text-sm text-gray-500 ml-7">${request.description}</p>
                            <p class="text-sm text-gray-500 ml-7">${request.user.userName} - Client</p>
                            <p class="text-sm text-gray-500 ml-7"><span class="font-semibold text-white">KG Totales de la Recolección:</span> ${request.quantityUnit} KG</p>
                            <div class="flex justify-center overflow-hidden">
                                <img src="/public/assets/img/trash_truck_resource.png" alt="Collection img" class="object-cover w-[45vh]">
                            </div>
                        </div>

                        <!-- Right side content -->
                        <div class="w-[50vh] flex flex-col justify-start ml-10 z-50 h-full mt-4">
                            <!-- Modal header -->
                            <div class="flex items-center justify-between p-4 md:p-5 relative">
                                <h3 class="font-semibold text-3xl text-white">Collection Status</h3>
                            </div>
                            <!-- Modal body -->
                            <div class="p-4 md:p-5 flex-grow">
                                <ol class="relative ms-3.5 mb-4 md:mb-5">
                                    <li class="mb-10 ms-8">
                                        <button class="absolute time-line flex items-center justify-center w-6 h-6 bg-gray-400 rounded-full -start-3.5 ring-8 ring-gray-400 hover:bg-gray-500 transition text-white">
                                            <ion-icon name="time"></ion-icon>
                                        </button>
                                        <h3 class="flex items-start mb-1 text-lg font-semibold text-gray-400">
                                            Pending
                                        </h3>
                                        <time class="block mb-2 text-sm font-normal leading-none text-gray-400 ">Released
                                            on January 13th, 2022</time>
                                    </li>
                                    <li class="mb-10 ms-8">
                                        <button
                                            class="absolute flex items-center justify-center w-6 h-6 bg-gray-400 rounded-full -start-3.5 ring-8 ring-gray-400 hover:bg-gray-500 transition text-white">
                                            <ion-icon name="cube"></ion-icon>
                                        </button>
                                        <h3 class="flex items-start mb-1 text-lg font-semibold text-gray-400">
                                            In Collection
                                        </h3>
                                        <time class="block mb-2 text-sm font-normal leading-none text-gray-400 ">Released
                                            on January 13th, 2022</time>
                                    </li>
                                    <li class="mb-10 ms-8">
                                        <button
                                            class="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full -start-3.5 ring-8 ring-green-500 hover:bg-green-600 transition text-white">
                                            <ion-icon name="sync"></ion-icon>
                                        </button>
                                        <h3 class="flex items-start mb-1 text-lg font-semibold text-green-500">
                                            In Progress
                                        </h3>
                                        <time class="block mb-2 text-sm font-normal leading-none text-white">Released
                                            on January 13th, 2022</time>
                                    </li>
                                    <li class="mb-10  ms-8">
                                        <button
                                            class="absolute flex items-center justify-center w-6 h-6 bg-gray-400 rounded-full -start-3.5 ring-8 ring-gray-400 hover:bg-gray-500 transition text-white">
                                            <ion-icon name="checkmark-done"></ion-icon>
                                        </button>
                                        <h3 class="flex items-start mb-1 text-lg font-semibold text-gray-400">
                                            Completed
                                        </h3>
                                        <time class="block mb-2 text-sm font-normal text-gray-400">Released
                                            on January 13th, 2022</time>
                                    </li>
                                </ol>
                                <button class="z-50 text-white inline-flex w-full justify-center bg-green-500 mb-7 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    Download Certificate
                                </button>
                            </div>
                            <button type="button" class="text-gray-400 bg-transparent hover:text-white rounded-lg text-3xl h-8 w-8 inline-flex justify-center items-center absolute right-4 top-4" data-modal-toggle="admin-modal-${request.id}" id="closeModalBtn">
                                <ion-icon name="close-outline"></ion-icon>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    });

    
}
// Funcion para renderizar todas las solicitudes.
function renderAllRequests(requests) {
    cleanTbody(tbody2);

    requests.forEach((request) => {
        tbody2.innerHTML += `
        <tr class="bg-gray-900 border-b border-gray-800 hover:bg-gray-800">
                        <td class="px-6 py-4 text-white whitespace-nowrap">
                            ${request.user.userName}
                        </td>
                        <td class="px-6 py-4">
                            ${request.description}
                        </td>
                        <td class="px-6 py-4">
                            ${new Date(request.dateTime).toLocaleString()}
                        </td>
                        <td class="px-6 py-4">
                            ${request.typeWaste}
                        </td>
                        <td class="px-6 py-4">
                            ${request.quantityUnit}
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center">
                                <div class="h-2.5 w-2.5 rounded-full ~${request.status == "PENDING" ? "bg-orange-500" : "bg-green-500"} mr-2"></div> ${request.status}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <button class="font-medium text-green-500 hover:underline">Download</button>
                        </td>
                    </tr>
        `;
    });

     // Re-initialize modals if Flowbite is available
     if (typeof Flowbite !== 'undefined') {
        document.querySelectorAll('[data-modal-toggle]').forEach(button => {
            const modalId = button.getAttribute('data-modal-toggle');
            const modal = document.getElementById(modalId);
            if (modal) {
                button.addEventListener('click', () => {
                    modal.classList.toggle('hidden');
                });
            }
        });
    }
}
//  Funciona para eliminar la informacion de los Tbody.
function cleanTbody(body) {
    console.log(body)
    while (body.firstChild) {
        body.removeChild(body.firstChild)
    }
}


