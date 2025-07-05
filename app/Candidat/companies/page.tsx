"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NavbarCandidat from "@/app/components/NavbarCandidat";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Entreprises statiques par défaut
const staticCompanies = [
	{
		name: "DXC Technology",
		logo: "/images/dxc.png",
		rating: 5,
		reviews: 254200,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
	{
		name: "ALTEN",
		logo: "/images/alten.png",
		rating: 4,
		reviews: 900,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
	{
		name: "Deloitte",
		logo: "/images/image1.png",
		rating: 5,
		reviews: 13814,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
	{
		name: "Crédit Agricole",
		logo: "/images/logo.png",
		rating: 4.0,
		reviews: 3494,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
	{
		name: "ONCF",
		logo: "/images/ONCF.jpg",
		rating: 3.5,
		reviews: 64,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
    {
		name: "CGI",
		logo: "/images/CGI.png",
		rating: 4.5,
		reviews: 4011,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
    {
		name: "LEONI",
		logo: "/images/image2.png",
		rating: 3.5,
		reviews: 40707,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
    {
		name: "Intelcia",
		logo: "/images/image.png",
		rating: 3,
		reviews: 1422,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
    {
		name: "Concentrix",
		logo: "/images/default-companylogo.png",
		rating: 3.5,
		reviews: 40707,
		tags: ["Salaires", "FAQ", "Emplois ouverts"],
	},
];

export default function CompaniesPage() {
	const [search, setSearch] = useState("");
	const [companies, setCompanies] = useState(staticCompanies);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const [dbCompanies, setDbCompanies] = useState<any[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const companiesPerPage = 8;
	const totalPages = Math.ceil(companies.length / companiesPerPage);
	const paginatedCompanies = companies.slice((currentPage - 1) * companiesPerPage, currentPage * companiesPerPage);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
	// Charger les entreprises de la BDD au montage
	useEffect(() => {
		const fetchDbCompanies = async () => {
			try {
				const res = await fetch(`${API_BASE_URL}/api/companies/all`);
				const data = await res.json();
				// Adapter la structure des entreprises BDD pour correspondre à l'affichage
				const mapped = data.map((c: any) => ({
					name: c.companyName || c.name || c.company_name || "Unknown Company",
					logo: c.companyLogo || c.logo || "/images/default-companylogo.png",
					rating: c.rating || 4, // valeur par défaut si absente
					reviews: c.reviews || 0,
					tags: c.tags || ["Salaires", "FAQ", "Emplois ouverts"],
				}));
				setDbCompanies(mapped);
				const merged = [
					...staticCompanies,
					...mapped.filter((c: any) => !staticCompanies.some(s => s.name.toLowerCase() === c.name.toLowerCase())),
				];
				setCompanies(merged);
			} catch {
				setDbCompanies([]);
			}
		};
		fetchDbCompanies();
	}, []);

	useEffect(() => {
		setCurrentPage(1); // reset page on new search or data
	}, [companies.length, search]);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!search.trim()) {
			const merged = [
				...staticCompanies,
				...dbCompanies.filter((c: any) => !staticCompanies.some(s => s.name.toLowerCase() === c.name.toLowerCase())),
			];
			setCompanies(merged);
			setSearched(false);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE_URL}/api/companies/all`);
			const data = await res.json();
			const mapped = data.map((c: any) => ({
				name: c.companyName || c.name || c.company_name || "Unknown Company",
				logo: c.companyLogo || c.logo || "/images/default-companylogo.png",
				rating: c.rating || 4,
				reviews: c.reviews || 0,
				tags: c.tags || ["Salaires", "FAQ", "Emplois ouverts"],
			}));
			const all = [
				...staticCompanies,
				...mapped.filter((c: any) => !staticCompanies.some(s => s.name.toLowerCase() === c.name.toLowerCase())),
			];
			const filtered = all.filter((c: any) =>
				c.name.toLowerCase().includes(search.trim().toLowerCase())
			);
			setCompanies(filtered.length > 0 ? filtered : []);
			setSearched(true);
		} catch (err) {
			setCompanies([]);
			setSearched(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-white" style={{ zoom: 0.9 }}>
			<NavbarCandidat />
			<div className="max-w-6xl mx-auto py-10 px-4">
				<div className="mb-10 text-center">
					<h3 className="text-4xl md:text-4xl font-extrabold mb-2 text-blue-900 drop-shadow-sm">Discover Companies</h3>
					<p className="text-lg md:text-xl text-gray-500 font-medium">Find the best companies that match your ambitions and values.</p>
				</div>
				<form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 justify-center items-center">
					<div className="relative w-full sm:w-2/3">
						<input
							type="text"
							placeholder="Company name or job title"
							value={search}
							onChange={e => setSearch(e.target.value)}
							className="w-full border border-blue-200 rounded-xl px-5 py-3 text-lg focus:ring-2 focus:ring-blue-400 shadow-sm bg-white pr-12 transition"
						/>
						<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
							<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#60a5fa" strokeWidth="2"/><path stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/></svg>
						</span>
					</div>
					<button
						type="submit"
						className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold px-8 py-3 rounded-xl text-lg shadow hover:from-blue-700 hover:to-blue-900 transition"
					>
						Search
					</button>
				</form>
				{loading ? (
					<div className="text-center py-10 text-blue-600 font-semibold text-lg animate-pulse">Loading...</div>
				) : (
					<>
						{companies.length === 0 && searched ? (
							<div className="text-center text-gray-500 py-10 text-lg">No companies found.</div>
						) : (
							<>
								<h2 className="text-2xl font-bold mb-6 text-blue-800 text-left">Most Popular Companies</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-28 gap-y-4 md:gap-x-36 md:gap-y-6 lg:gap-x-44 lg:gap-y-8 xl:gap-x-56 xl:gap-y-10 mb-8 justify-items-center">
									{paginatedCompanies.map((company: any, idx: number) => (
										<div
	key={company.name + idx}
	className="bg-white border border-blue-100 rounded-3xl shadow-xl p-6 flex flex-col items-center hover:shadow-2xl transition group relative min-h-[220px] min-w-[320px] max-w-md w-full"
										>
											<div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center mb-3 border-2 border-blue-100 group-hover:border-blue-400 transition">
												<Image
													src={company.logo || "/images/default-companylogo.png"}
													alt={company.name}
													width={64}
													height={64}
													className="object-contain w-full h-full"
												/>
											</div>
											<div className="font-extrabold text-xl text-blue-900 mb-1 text-center truncate w-full" title={company.name}>{company.name}</div>
											{company.industry && (
												<span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-blue-100">{company.industry}</span>
											)}
											<div className="flex items-center gap-1 mb-2">
												{Array.from({ length: 5 }).map((_, i) => (
													<span key={i} className={
														i < Math.floor(company.rating)
															? "text-pink-500"
															: i < company.rating
															? "text-pink-400"
															: "text-gray-300"
													}>
														★
													</span>
												))}
												<span className="text-xs text-gray-500 ml-1">{company.reviews.toLocaleString()} reviews</span>
											</div>
											<div className="flex flex-wrap gap-2 mt-1 justify-center">
												{(company.tags || []).map((tag: string) => (
													<span
														key={tag}
														className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-100"
													>
														{tag}
													</span>
												))}
											</div>
											{company.companyDescription && (
												<div className="mt-3 text-xs text-gray-500 text-center line-clamp-3">{company.companyDescription}</div>
											)}
										</div>
									))}
								</div>
								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex justify-center items-center gap-4 mt-10">
										<button
											disabled={currentPage === 1}
											onClick={() => setCurrentPage(currentPage - 1)}
											className="w-11 h-11 flex items-center justify-center rounded-full border border-blue-200 bg-white shadow hover:bg-blue-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 text-xl"
											aria-label="Previous page"
										>
											<FaChevronLeft />
										</button>
										<span className="px-3 text-blue-700 font-bold text-lg select-none">{currentPage} / {totalPages}</span>
										<button
											disabled={currentPage === totalPages}
											onClick={() => setCurrentPage(currentPage + 1)}
											className="w-11 h-11 flex items-center justify-center rounded-full border border-blue-200 bg-white shadow hover:bg-blue-100 transition disabled:opacity-40 disabled:cursor-not-allowed text-blue-700 text-xl"
											aria-label="Next page"
										>
											<FaChevronRight />
										</button>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
