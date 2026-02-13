import React, { useState, useCallback } from 'react';
import { useFormData } from './hooks/useFormData';
import { useValidation } from './hooks/useValidation';

import ChapterToggle from './components/form/ChapterToggle';
import CoverForm from './components/form/CoverForm';
import PerformanceForm from './components/form/PerformanceForm';
import FollowerForm from './components/form/FollowerForm';
import CaseStudyForm from './components/form/CaseStudyForm';
import PricingForm from './components/form/PricingForm';
import FlowForm from './components/form/FlowForm';
import ContactForm from './components/form/ContactForm';
import MarkdownPreview from './components/preview/MarkdownPreview';

import './App.css';

const VIEWS = { FORM: 'form', OUTPUT: 'output' };

function App() {
  const { chapters, formData, toggleChapter, updateFormSection, resetAll } = useFormData();
  const { errors, validate, clearErrors } = useValidation();
  const [view, setView] = useState(VIEWS.FORM);

  const handleOutput = useCallback(() => {
    validate(formData, chapters);
    setView(VIEWS.OUTPUT);
  }, [formData, chapters, validate]);

  const handleBackToForm = useCallback(() => {
    setView(VIEWS.FORM);
    clearErrors();
  }, [clearErrors]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-logo">📋 Proposal Generator</h1>
          <p className="app-subtitle">インフルエンサー営業資料データを簡単作成 → NotebookLMへ</p>
        </div>
      </header>

      <div className="view-toggle-bar">
        <button
          className={`view-toggle-btn ${view === VIEWS.FORM ? 'active' : ''}`}
          onClick={handleBackToForm}
        >
          ✏️ 入力
        </button>
        <button
          className={`view-toggle-btn ${view === VIEWS.OUTPUT ? 'active' : ''}`}
          onClick={handleOutput}
        >
          📄 Markdown出力
        </button>
      </div>

      <main className="app-main">
        {view === VIEWS.FORM ? (
          <div className="form-container">
            <ChapterToggle chapters={chapters} onToggle={toggleChapter} />

            <CoverForm
              data={formData.cover}
              onChange={(data) => updateFormSection('cover', data)}
            />

            {chapters.performance && (
              <PerformanceForm
                data={formData.performance}
                onChange={(data) => updateFormSection('performance', data)}
              />
            )}

            {chapters.follower && (
              <FollowerForm
                data={formData.follower}
                onChange={(data) => updateFormSection('follower', data)}
              />
            )}

            {chapters.caseStudies && (
              <CaseStudyForm
                data={formData.caseStudies}
                onChange={(data) => updateFormSection('caseStudies', data)}
              />
            )}

            {chapters.pricing && (
              <PricingForm
                data={formData.pricingPlans}
                onChange={(data) => updateFormSection('pricingPlans', data)}
              />
            )}

            {chapters.flow && (
              <FlowForm
                data={formData.flow}
                onChange={(data) => updateFormSection('flow', data)}
              />
            )}

            <ContactForm
              data={formData.contact}
              onChange={(data) => updateFormSection('contact', data)}
            />

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleOutput}>
                📄 Markdown出力へ
              </button>
              <button className="btn btn-secondary" onClick={resetAll}>
                🔄 リセット
              </button>
            </div>
          </div>
        ) : (
          <MarkdownPreview
            formData={formData}
            chapters={chapters}
            errors={errors}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Proposal Generator for NotebookLM — インフルエンサー営業資料データ作成ツール</p>
      </footer>
    </div>
  );
}

export default App;
