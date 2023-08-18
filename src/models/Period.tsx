import React from "react";
import Company from './Company';
import Base from './Base';
import EditText from './EditText';
import Times from './Times';
import Project, {IProject} from './Project';
import Description from "./Description";
import Achievement from "./Achievement";
import styled from "styled-components";
import {Divider, TimeLineItem} from "./components";
import {IAchievement, JobPosition} from "./types";
import Keywords from "./Keywords";
import ArrayData from "./ArrayData";
import {nonenumerable} from "core-decorators";
import {formatAndTranslateResume} from "../service";

export interface IPeriod {
    start: string;
    end?: string;
    keywords: string[];
    company: string;
    periodColor?: string;
    jobPosition: JobPosition;
    achievements: IAchievement[];
    jobSummaries: string[];
    projects?: IProject[];
    descriptions: string;
}

const Content = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: var(--base-border-radius);
  width: 100%;
`
const PeriodHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
`
const JobTitle = styled.div`
  font-size: var(--base-font-size-large);
`
const Time = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

class Period extends Base {
    public keywords: Keywords;
    public descriptions: Description;
    public achievements: ArrayData<Achievement>;
    public jobSummaries: ArrayData<Description>;
    public company: Company;
    public jobPosition: EditText;
    public projects: ArrayData<Project>;
    public periodColor?: string;
    private times: Times;

    constructor({
                    company,
                    jobSummaries,
                    jobPosition,
                    achievements,
                    keywords,
                    descriptions,
                    start,
                    end,
                    periodColor,
                    projects
                }: IPeriod) {
        super();
        this.company = new Company(company).setParent(this);
        this.times = new Times(start, end).setParent(this);
        this.achievements = new ArrayData<Achievement>(
            achievements?.map(a => new Achievement(a?.text, a?.categories).setParent(this)),
            () => new Achievement('', [])
            , false, '编辑成就').setParent(this);
        this.jobSummaries = new ArrayData<Description>(
            jobSummaries?.map(d => new Description(d, 'input').setParent(this)),
            () => new Description('', 'textarea', '岗位职责', '请描述岗位职责'),
        ).setParent(this);
        this.keywords = new Keywords(keywords).setParent(this);
        this.descriptions = new Description(descriptions, 'textarea', '职位简介').setParent(this)
        this.jobPosition = new EditText(jobPosition, 'input', '职位').setParent(this);
        this.projects = new ArrayData<Project>(projects?.map(e => new Project(e)) ?? [], () => new Project({
            name: '',
            challengeAndSolutions: [],
            descriptions: '',
            achievements: [],
            keywords: [],
            start: '',
            end: '',
        }), false, '编辑项目经历').setParent(this);
        this.periodColor = periodColor;
        this.canTranslate = true;
    }

    @nonenumerable
    onTranslate = async () => {
        const data = await formatAndTranslateResume(this.toTranslate());
        this.updateTranslate(data)
    }
    View = () => {
        const JobPosition = this.jobPosition.Show;
        const Company = this.company.Show;
        const Keywords = this.keywords.Show;
        const Times = this.times.Show;
        const Descriptions = this.descriptions.Show;
        const Achievements = this.achievements.Show;
        const Projects = this.projects.Show;
        return (
            <>
                <div style={{display: 'flex'}}>
                    <div style={{marginTop: 30}}>
                        <TimeLineItem start={this.times.start} end={this.times.end} periodColor={'black'}/>
                    </div>
                    <Content>
                        <PeriodHeader>
                            <div style={{display: "flex", alignItems: 'end'}}>
                                <JobTitle>
                                    <div style={{
                                        fontSize: 'var(--base-font-size-large)'
                                    }}>
                                        <JobPosition/>
                                    </div>
                                    <Company/>
                                </JobTitle>
                                <Divider variant="v"/>
                                <div>
                                    <Keywords/>
                                </div>
                            </div>
                            <Time>
                                <Times/>
                            </Time>
                        </PeriodHeader>
                        <div>
                            <Descriptions/>
                        </div>
                        <div>
                            <ul>
                                {this.jobSummaries?.data?.map(summary => <li>
                                    <summary.Show/>
                                </li>)}
                            </ul>
                        </div>
                        <div>
                            {this.achievements?.data?.length > 0 && <div>Achievements:</div>}
                            <ul style={{
                                fontSize: 'var(--base-font-size-middle)'
                            }}>
                                <Achievements/>
                            </ul>
                        </div>
                        <div>
                            <Projects/>
                        </div>
                    </Content>
                </div>
            </>
        )
    }

    toJSON() {
        const json = {
            ...this,
            start: this.times.start,
            end: this.times.end,
        }
        // @ts-ignore
        delete json.times;
        return json
    }

    toTranslate() {
        return {
            jobPosition: this.jobPosition,
            jobSummaries: this.jobSummaries,
            descriptions: this.descriptions,
            company: this.company,
        }
    }

    updateTranslate(d: any) {
        this.jobPosition.text = d?.jobPosition;
        this.jobSummaries?.data?.forEach((j, index) => {
            j.text.text = d?.jobSummaries?.[index];
        });
        this.descriptions.text.text = d?.descriptions;
        this.company.name.text = d?.company;
        this.emit('value-change')
    }
}

export default Period