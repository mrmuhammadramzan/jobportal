"use client";
/**
 * JobSearchBar — hero search bar for the job platform.
 * DRY Rule: single reusable search input used on hero and /jobs page.
 *
 * Frontend SOP §7 Forms: visible labels (sr-only for visual design), submit feedback,
 * keyboard operable, autocomplete attributes set.
 * UI/UX SOP §Hard Rule 6: keyboard + touch operable, no hover-only interactions.
 */
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function JobSearchBar() {
  const [jobTitle,  setJobTitle]  = useState("");
  const [location,  setLocation]  = useState("");
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (jobTitle.trim()) params.set("q", jobTitle.trim());
      if (location.trim()) params.set("location", location.trim());
      router.push(`${ROUTES.jobs}?${params.toString()}`);
    },
    [jobTitle, location, router]
  );

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      aria-label="Search for jobs"
      className="w-full max-w-3xl"
    >
      {/* Visually hidden labels — labels ARE present for accessibility */}
      <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-[var(--radius-2xl)] bg-[var(--bg-base)] border border-[var(--border-default)] shadow-[var(--shadow-3)]">

        {/* Job title input */}
        <div className="flex-1 flex items-center gap-2 px-3">
          <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M8 14A6 6 0 108 2a6 6 0 000 12zm0 0l9 9" strokeLinecap="round" />
          </svg>
          <label htmlFor="job-search-title" className="sr-only">Job title, keywords, or company</label>
          <input
            id="job-search-title"
            type="search"
            name="q"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="Job title, keywords, or company"
            autoComplete="off"
            className="flex-1 h-11 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-[var(--text-base)] outline-none border-none focus:ring-0"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-[var(--border-default)] my-2" aria-hidden="true" />

        {/* Location input */}
        <div className="flex-1 flex items-center gap-2 px-3">
          <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <label htmlFor="job-search-location" className="sr-only">City, province, or Remote</label>
          <input
            id="job-search-location"
            type="text"
            name="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="City, province, or Remote"
            autoComplete="off"
            className="flex-1 h-11 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-[var(--text-base)] outline-none border-none focus:ring-0"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex-shrink-0 h-11 px-6 rounded-[var(--radius-xl)] font-semibold text-[var(--text-sm)] text-white bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)] hover:brightness-110 hover:shadow-[var(--shadow-brand)] active:scale-[0.97] transition-all duration-[var(--dur-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2"
          aria-label="Search jobs"
        >
          Search Jobs
        </button>
      </div>
    </form>
  );
}
