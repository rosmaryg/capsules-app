import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {GithubJsonService} from '../services/github-json/github-json.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {MatStepper} from '@angular/material/stepper';

import * as html2pdf from 'html2pdf.js';
import {Highlight} from '../shared/highlight/highlight/highlight.model';
import {NotesModalComponent} from '../notes-modal/notes-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  pageIndexSelectVal = 0;
  pageIndex = 1;
  pageCount = 10;
  pagesArray = [];
  private sub: any;
  idString = 'id';
  content: any;
  logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAABMCAYAAABatprmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAMO2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTI1VDE5OjUyOjI3KzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA2LTE0VDA5OjQwOjQzKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0xNFQwOTo0MDo0MyswNTozMCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNTAyMWYxZS03MTFlLTQxNGEtYjBlMi0zOTA1Y2UyZjNiMGUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZmRlZWZhYi1lODg1LWU3NDItODBkNS0xZDdiYmFkY2FhMWYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyYTI2NmQ4OC03ODhkLTQ0Y2YtODhlMS1iMjRkYWEwMDRlN2UiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIyNDQiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI3NiI+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDozMWI1ZmQxMS02YTYwLTllNGEtYTFlZC1lOWRiYzE1ODMwYTE8L3JkZjpsaT4gPHJkZjpsaT5hZG9iZTpkb2NpZDpwaG90b3Nob3A6NDZjMGM3YjQtNTU3Yi1kYzRiLWJlYmEtOTVkZTBiMzYyMjkzPC9yZGY6bGk+IDxyZGY6bGk+eG1wLmRpZDoyYTI2NmQ4OC03ODhkLTQ0Y2YtODhlMS1iMjRkYWEwMDRlN2U8L3JkZjpsaT4gPHJkZjpsaT54bXAuZGlkOjczN2ExYWJhLTBjOTYtNDY3ZS05MTA5LTVlYTQzYzBhOTlkMDwvcmRmOmxpPiA8cmRmOmxpPnhtcC5kaWQ6OTZlNDcyZmYtZTkyYi00NDFlLTllM2ItNGE1MDE4ODIxZWU4PC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MmEyNjZkODgtNzg4ZC00NGNmLTg4ZTEtYjI0ZGFhMDA0ZTdlIiBzdEV2dDp3aGVuPSIyMDIwLTAxLTI1VDE5OjUyOjI3KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjRlNmU5YTAxLWZkYjgtNGUwOS1hOTY4LWZjNGFjMmQ4MmE3NiIgc3RFdnQ6d2hlbj0iMjAyMC0wMS0yNVQxOTo1NTozNSswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NGQ2YjZmZi0xOTNlLTQ3OWUtOWI4Yi1iZTdkMzFhMjVlMWQiIHN0RXZ0OndoZW49IjIwMjAtMDYtMTRUMDk6NDA6NDMrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjUwMjFmMWUtNzExZS00MTRhLWIwZTItMzkwNWNlMmYzYjBlIiBzdEV2dDp3aGVuPSIyMDIwLTA2LTE0VDA5OjQwOjQzKzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc0ZDZiNmZmLTE5M2UtNDc5ZS05YjhiLWJlN2QzMWEyNWUxZCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmZiYjU0NzQyLTE5MzEtYTc0YS1iYzVkLTBkYTFhMWY1YzdkYSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjJhMjY2ZDg4LTc4OGQtNDRjZi04OGUxLWIyNGRhYTAwNGU3ZSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkFV6+kAABfjSURBVHic7Z15uFVV2cB/IIFDMonj8lVBLS2nRDNDBRMUw3mgzKGrJZialiOmlqWlVJ+ZWgFl4tDjgBViGIqzYH4JJGUmDji8rkQlEbNwQvrjXZuzzuGcc8+wL/deWL/nOc/de+2111537/3uNbzD6kKiIiLuIGAQsDswXNX/t45zNwS+CuwAzFD1V0VlvqPq726DKidWc7q0dwXyQsT1AE4C1gPmARsC/wQWAQ+o+ndrKKM3sL6qfybsrwHMABar+uEN1GkkcAuwvap/QsRtACwAHlb1g+stL5Foja7tXYE8EHFbALOApar+26r+N6r+cmAr4PRahDnwEPC1aH8ZsDVwZ4NV2xp4UdU/EfYXAmcCoxssL5GoSrf2rkCziLh+wH3Ab1X91SWH76ijnE2B7YGzo+TdsBa/UYE+ID5X1X8I/KTBshKJVun0Ag1cjf0fF1Y4fn+2IeJOwLri7wOfBf6i6i8WcfsCRwHvAJuLuBbgemAE8Aywpoi7BPgC8C1VPymUtwZwLtAj/N5X9ReGY+tjH4Tvh/3DgW8Az6j6E6I6HQ7sB/wZ2ELVX9Dk/UisxnTqLreI2wETsp+o+ndKj6v6uap+Zsh7OrCnqr8U+BNwKPBYyHc3sC5wv6qfoOonhtb0gJBnWBC0/wCfiS4xHthG1X8HuBK4QMRtFY6NAN4F7g3C3QP4O/CxqP6jgfOB04A+wPkirlcOtyaxmtKpBRo4PvydVC2TiPsE8F3gnCwJa40fDMe7AUOBadE5mwI7AmsCV4q4TbAZ60fC8SHAl4Ex4ZS1w9/Nw98DsMm4JcDOwGTgMOCucP5m2EfgxPAxeh44RdUvruP/TySK6OwCvScwT9W/3Eq+i4HbVP3rYX8E8FAQNrDudy+CsAU+H/5eo+qXYi36u1Gec4G7VP0/w37/8PdVEdcd2BeYCqDq7wp1XR+4OeQ7D+vyzw55blP1P6/t304kytPZx9CbAH8td0DE7QQoNlN9ECaQiLiewMHAd6Ls+wPPq/p5UdoI4Engj2H/MOBOVf+2iFsb+Bwm1BmDgH8B/wjH1iUIdOAoYFamEgvl/aqO/zWRaJXO3kK/DXxY4diZmA56CPbheiSkt2DCNi0a7+5PoSu8pYhbE+uC/1rVLwv64yHApHDO5kB3ij8mI0P+pVh3+ylggYjbJJR3KHCziNsqGJ1sADzb3L+fSBTT2QX6PmBbEVdkICPiRgC9w8TWRtjs8xsirj8wGGu5PbBDaLF3xAS8LzAw5FkbMwoBE9D3MBXU4LAN8Ea43sGYemtsSN8Ha50PxCbS9sM+IjdhH4rsvr8Xzl9DxJ2Sxw1JrN509i73BcCuwHdF3PeB3pjwrAc8HPL8FfhIUA9tg7XUA4DTMQFcB1NjbYeNpS8K6XOjsfmmmFHIKcB1mLXXbGA7EQfwLWCEqv9XyO9CuRuo+sXhQ/Im8EVgqqp/RcQ9BpwWWu9PApfneWMSqyed3vRTxHXFbK37A69hgvwe0COzvRZxe2It7t2YoA0H7lP1WQu7E2bVNV3VvyniNsKszl4Px3tjH4pHVL2GtI9iLfFSTN31n6hOu2L67jtV/Ycibl2sWz9L1c8PedYBhgH/DudXGjokEolEIpFIJBKJRCKRSCQSiUSiEjXPcgc3xV2ALYG+wBrAEiyIwFOYmue9yiUkGiXMqO8MbIE5cfTBDGpex2zAZ0dmrY2UvykFFeZr9URmqaHsLaLdBeWcaBLLtTXbYirM9bBn3B3TgrwM/A14qjVtSFU9dLBJPhY4Efg01T8A/xVxfwQmtFV4naDPnR8ljVD1jfoql5Z9Baabrpe3ML30PEzHPUXVP5lDfdYCjsbu/yDsA1ot/yxMRz5R1b9d5+VmUHAqORRzJCnLwpPcNyj4dD/Yb5wf0krZz0fbewMPlMsUBD/O21/Vv9BK2Q0j4iZjJsBtwd6q/oEa6/FZLFTVQZggV+M1EXcbcLWq/0e5DBUtxYK11TzM3ng3Wm/N1wYOB+4ScTNE3Dat5G+EL7ey3x70xFwiDwQuBf4e/v/PNVqgiDsO+3D9EtiLVoQ5sAtwFfBs8OdOdGBE3MdE3HRgJuY12Jowg5kLn4y9Y9eKuBXOWaGFDk3/WOCskkPPA38A5gCvYE4PfTEDit0xw4meIe8gYI6IO1bV/7aGirZKMO8sFeCDRVxvVf9mHteIeBUbRrTG2tg92ARYK0ofhPlBXwOcXOtQJPSIrsMsymJeBO7FrNMWYFZnH8W8t7bFDGU+GfJuCFwr4oYBx6dhUE28CLyQY3lvVjso4o7AnvPaUfISzJT5EUzWFmEyth6wGbAHZojUHWtcW4B9RNxBqv7xrJAigQ5C8ysKfsZgETvOAu5Q9csq1PGnwQPpK5irYi/sBb9VxB2YU7d4MDaGjOmBvfzjcig/Zpqqb6k1c/gI7hDqchL2/4PdjwEibnhrghXu/S3AIVHyn4FvYxZs1cZOZ4UewUWYmybAl4B1RNzhwWEkUZmJqv6ilXEhEXcg9pyz3vFiLKrNNZnlYpVzNwa+iQ0Nu2N+/dNF3OBsmFfaQp9PsTDfhDng/4dWCBMpV4m42zHHhO1CpW8WcTuq+uerFtA6cet8I3BM2G4hf4GuiyBsjwOPi7gfYpFMjgiH9wZ+SnHwwXKcRrEwXw6cU6swqvr7RNz9mFto5hp6MPZMv1dLGeVYeJL7BMUx1XpG259ZeJJ7Idr/Xr9x/teNXmtVJwjk9RSE+UlsHuiFWs5X9a8A54i4W7De8kZAP+D2IGP/XT6GFnG7YFE9Mm4Ajq5FmEsu+hJm4+xD0rrY2K5hgt1zJiDvYC//S2F/tzYarzdE+MqOBCZGySeFyY+yhFns+N7/RtWfWW/LquqXhZZmbJR8YeQm2gjdsQmz7NcnOtaj5FjPFc5OxHwbcyAC89Qb3sjEXwiKMRzItBFbYR/uokmxq6P9uVjLXKmL3doFX8Nm7jJGiLjdGikrcDg2ZgSbRV6EtdIZLU2UnTvhvn0NeDpKPq/KKUdQ6Ka/hwUTbIYLsQlNsF7YmU2Wl2iSEDf+2Cjp0szRpxFU/VyKe16nibh1uoaL7YfNZGeMriOWdaULTsOC8WWc3ERxLdH29SV/AY4NETg7DEHfenGUNFzE9amQfa9oe6qqX9jktd+n2B3zqCbuz0vYMCz73RQdm1dyLK0GUpmdMU8/sMmu66vkrZWfYT1WsAbvgGwMHQvbVFX//zlcDKzSu4ftg0XcR8LLVjNBPzkk7L5GiCyi6ucFn+JdsVnmYURB/joIkzH3yjWwlnIPyscK7x9tP1HmeCP8IdruhcUcf7zeQvqN828QDR8WnuR6Y+GUABb0G+cnrnhWogybR9uvhV5sU4RwWPdi4bIAhnQNrcbno3x5Bqr7fbTdC9ipgTKOo6ADv0nVfxAduyHabmmg7DYlGHjMjpK2rZA11vEvqZCn3mv/E7Mky+gw8wyrKT2i7Tyt5eIwWFt1xWZhs5b6LWB6XldS9a9SmLwC+FQ955fRPd9QkuVmIBPwQ0Iggo5GPE7asEKeN6PtrXO89q3A7eHXsGloIhdejbY3DpaAefAohWc8N+sGZjxcb5e4Bm7FusVgY4d62BMLFwTwjyzkbYaqf13ETcNifrWVTrpZ4q9xpXHsHApmiCNEXPc8DEJU/anNlpHIjbnRdnfM1POWCnlrRtVPAaZk+12xAHkZs5q9QJkLnq3qh4TfL+s8vSXaLm2dy6W3VMjTnsTmef+ukOe2aHsDKi/rk+ikBB3yzCjp4rZYJaUrxdZXT1fIt9IJuucjw+4yitVUMVOwoQJ0MJ10IP5gvlguQ7Dyib/WF4i4c0qjmSY6PRdF21sDU0NI59zoikWozGh65i1HYt3zg5V0dkE9FAtDSxvXq2bE1t7aOEp6rEr2UymebxgL3B2W8elIvIuZKy7G4qInakTV3wNcESUNAp4QcccE8+Gm6Urx7FtVW9KVTEu03ZrOLu52dySddOyOqVRY5QMg6J73odhJYCj2wG8RcXt1hBa73zj/i37jfO/wO6C969MJOQu4Jtrvh72/T4i4E0Oc+IYpteXuEKFkS3TPSygeY5ZjBiYIW2A66X1oZyMHEbc/cEKUNL41yztV/6yIG4i5TR4WkrtgpqQjMdfI32M65pnJ6SI3NgqhnJthSclSSmUJz+yrwYbiR5hpNJhKcwJwhYj7AzaUnBbFeq+JjhpoP9Y9T1b1lSaTADO1FHE3YoH3wVr3dhPosJJGbFGlFHe1KhJswQ8XcUOx/2dwdHgrbEH6s4FFIu4OzHhlWrTwXqJ+RodfM8ylDjsLVT9exE3B1kcbja1yCuZSmX3APxRxM7Bn/Pta7L473FI4oVsZ27xWmt0uJc53aFvMIFZDxHURcYNE3G+xB5DpGZcAIxtwcrlH1Q/BLO2uYcUZ8j7Yh+932Bpa44ODTaKToOpfUfXfwHqWZ2MLHcZ0xcyCLweeF3H3i7jjgt98WTpiCz0Ia4nAlPE1tbSq/mkR92csVNKa2ELwExqsw04i7qIa8n0UE6xNMFvdDUqOLwQOV/WPNlgPwrmPirivY6t3HIJFR+kbZesJjAJGibi7gO/kaL67OvAgFUIj1cGCRk8MBlg/Bn4cuv6HhN+OJVmHhN8lIu4H2OKIRfYKHVGgW6Ltm+ocJ16PCXRWTqMCvSMr3sx6WIr1GM5T9Q0/6JjQpZ4MTA6TfntgxigjKdZU7AfsJ+J+DpyZgvLVxAMrK8BBa4ToI48DF4W5pIOx+ZTYgUeAXwCnirgvqfrlk62lXe6PtGVlWyNEPRkZJdXrkXILBVPQ3UXcx3KpWG0sxsIEjQG2UPXH5yXMpaj6par+QVV/Bmb0vz+RtVDgZOCBDmoOm6gBVf+Cqv+pqh+M9Vp/gL1nGZ/Eem/LfTFKW+iVOu4sw2EUZv2eVPV/qedkVb9QxE2lYEbZgq0MWS93YM7otfABOXnPNELowUzDlsP9FNYrycbSu2HRLPYpcWpJdDJU/XPA+SLuR9hk6TexBnkt4LYQhuixbpgxSTb2690elY1oibYb9Re9gYJAHyfiLmhgZcc34sBrnQVV/xcRtzs2ifL1kLwX9vB/1G4VS+RGCIh5VlBt3Y7Nn6wFXC/itu+GhQrKBHrTdqklIOI2A+LQtyeKuKMq5a9CPGxwmHHGauN4r+o/EHGnY55d2fDlPBF3VRpPrzqo+gdC9NDs3d4GOLIbFqgsc2vcLu8Li7jtMGsYgJdV/bMVssa6Z7AVOvKghdVIoGG5Xv4MzBa+CzYTP5TioAcxK8tApaGQVonyqPrpYotb7B+SvtgN87A6OiTsUfbM5riWwpjuHMp0/cr4Pb9Ncy9ZFwoB6w4Vcb1U/eJqJ7QXYgsaZL2KGc2GH8pQ9V5sNY3MdXVXKgt0rOPOy08XEVc6ydohn0FbI+K2p9BAvaTq5+RY/GQKAr1rN2xmNuPjIm7LMABvmqBeiVv9SkvExLrnd4BNmxVAEfdMKLNZnXRbM56C2unzwB9zLPsZCgLtquSLJ/Q2r5irfqRkf3UNsnAIhYB+U8h3CZ54QYiNu6r6v2EPPuNY8uOzFEzalmHRFcrREm1Pyak17bBRQUuIVVsDKuZqjDjQYzWbg/j5D8zx+rHl2r+xhQ1XR+IP2RY5l11kWJLpoSdGaaODPjgPvhBtP1rO0DwH3XMl4nJWtk66HuKP3NCcy94s2q6mE58Rbe+bY3icuCWa2WhY6FWA+Blvn7MPdNyjWpwJ9C+AzNZ4I8w4oilC8MHjoqSJFbLGuufXyWkCK6zUEb+oHWFhu3JMjbYPFHG5xBQTcesCn4mS5lbKi62MkbXmPSn2Emv0+kIhQAXkEG6nE/NXbElYsPmdr1fJWy/Dou05XQFC4PpLogPnBX1mM/yYgqAuoLKTRUu0fVPOMc1KY3d3OGcULCxxFilmDeCaMpNJjXAuhTjQS6gS4jgMca6Lkr4r4jZq8vpXUpjsW8BqLNDBDuLKKOns4CbbFOHjf0yU9Lv4Bb8cC1YHNt6aEmbnGrnQyRR/5c8u594nttB4rHuuFGaoUW6l0PJIybU6BOFhx1/sPTEjgR4VTmmV4L4Zr9Tx8/DRrsYlFCKQrIdZmDVkORgcWw6Jks5P7p1cRWE1k+7AHSKuYX8BEbc+NsOdvScLgInLBTp4bRxBYQDfD3hExB1NjYi4tUTcZVhE/4wbVX0lQY11z0+p+moheuomtDyxjXNLnuXnhaq/G/hhlPRFzEa34npY5RBx64i472MuldmzfZridbMq1UEp/rB8Gnv+NYdeFnE9Rdy1FBbLA3vprq21jFWVYNRzFIX4dxtj9/eMau6Q5RBxw7GVSePwVKNU/dtFM5+q/nkRtw8Wm3tDzD3wRhF3Krb21VQtWYs5tCQ7A/tiS6nGXbXbsSVVK9ESbdfq91wv11EYyx0m4nqq+reqndBOjMGEMFuXeydgpoibCUwC7gHmldpkhwmsnbC5iOModuFUbHXDqgEilmdWPzF0tS8NSZ8AZou427Dn81CpBiKoJj+FTYB9jeIop/djCx42Mhm2r4jLwz5+jtoCitXYRsQdksO1ql4zmOaOwD6462PBDP4PM+WchMnL7DL3uAumgt0bmwuKP/TLgFNU/R1QbJkVF7A58BtMP1zKS9hi1Gtgtt8bsqKX1lLspbiokvtjaH2ysKbLgP6qvmxUzGYI49GXKbzoJ6r6X5XJdwWFGGDXaR3rQ+dJeLGuorwZ7nuYqe5bmPD3wvTL5WKo3Q18uRGPLxF3DLaCyrolhz7EQj0tDHVZL9SzNB9YL+2MWuOLB1fBZpccLsfxqisu1yPiJpOvPrjVa0bXFuz+HFghyyuYjL2PNarrU35lz1eBr6j65ROrZSeJgmANxlrX0pu8GeYrvB32MGNh/gCL/7Wjqr+wFV/mlmj7obYQZli+cFscDqilQtYOgaqfjNnlnk6x0QDY2Ks/dv+3x55FqTA/DByk6vdr1H0zDJG2xYxe4rFvV0xX/mnMqnBbVhTme4E9VP2peSwWsCqi6lXVH4TJ2BQKLr8ZG2O9ox0xC7NSYX4VG9Z8PBZmqNBCx4SZ4SGYedkumN4ri5bxFtZiPAE8gnXJa+omibgToor+qS0jbIi4AdhKBWC9gZ+V6boOpmDT/mQY17Y7YWJyH8zia2tsSNMTayHfxCK1PoXpOu+soXtZ7/V7YS3J3tgLthlmG94NM+V8BXv+MzGjoPkNXicXdVkZ7laLe156vQPJz1+gpmtWQsT1xdRPgzBBztbh7oY94zexnvEcLLrKQylAZCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiVUKEXekiFsWfrOaKGeAiFth6WMRN1TEvRFdY1RzNa54/TeCsVKHoyMuhZNYdblV1ee1xnWfMmnTgb41uIq2xbVXGiJuqNri8SvQER3+E6sgIYJNm5e/EoS5XQk9g+mVjuf1tUwkWkXEPQdMUvVjStIvwyKsAMwHhqn6+aFbvUtmH57th3zPlbb2oRs/HxgTnTMAmKXq+5bulwjHAMzDaZiqny3ilmEurZeVqdcyYMuwPR5b+RNgNmaT3QcLj03YHo3Fi8vceEer+gmhPtXOn48FbZwf0hdhtvsZo8Ox7H8Yk1roxEpD1W8JDAhj0IEAYZw7UNV3CQI6hsILWtqqV23lVf0u2Av+XBCUSufF+wOw9bu7YMEq49avtF5F434Rd264bpZnEuahll1jl5A+HpgftvtmeWo4P6vXBOCy0PvYMjpnAvbBGRb2xyaBTqxUVP1IrLXJhGMUMDY6PgkT+oa66Kp+TBCCPiVCXe2c2eHvPVA0PBgT5ZkUyozrdSS2Jvey0GpfRhS5tcTzbEJIWxSuMaCO8ydRHHAxZgIwPpsATAKdWOlkAtTGM8VjaCwscr0fkqx1zH59Wz8lv/NDKz0S+zCMTwKdWGlkAhxNYM3HWp9zozyjsO7pIqKWqRbhL8kzCrgnGkv3idIXlTtPxA2Nrk1JvY4sOUZp3RugkfNXmPQLH8gxwMCktkqsFMKYeXokWCMBVP3YoFfO4o7NpjDxNQaYFSbN5lP8MpcKZWn596j6LGb1aOANEQfWRS1thacHoc4mnzIGltQrO7aoQt0JearWtYHz43MWibhs0m4k9kEYGJ2bSKyelBGm+Niyjmo8Uo3U5U6s7lTSW3dKffb/AE/OiMfbtvfiAAAAAElFTkSuQmCC';

  personalConnectionCanceled = false;

  // highlightsMap = new Map<string, Highlight>();

  private pdfBorder: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private githubJsonService: GithubJsonService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const contentId = params[this.idString];

      this.githubJsonService.getContent(contentId)
        .subscribe((data: any) => {
          this.content = data;
          this.pageCount = data.slides.length;
          this.pagesArray = Array.from(Array(this.pageCount).keys());
          this.prepKeyTakeaways();
          this.prepQuestions();
          this.getVideos();
          this.collectHighlights();

          if (this.content.meta.hasActivities) {
            this.content.meta.activitiesSelected = true;
          }
        });
    });
  }

  collectHighlights() {
    for (const slide of this.content.slides) {
      if (slide.highlights === undefined) {
        slide.highlights = [];
      }
    }
  }

  prepQuestions() {
    const questionArray = [];
    for (const question of this.content.suggestedQuestions) {
      const preppedQuestion = {
        question,
        selected: true
      };

      questionArray.push(preppedQuestion);
    }

    this.content.suggestedQuestions = questionArray;
  }

  prepKeyTakeaways() {
    for (const slide of this.content.slides) {
      const takeawayArray = [];
      for (const keyTakeAway of slide.keyTakeAways) {
        const preppedTakeaway = {
          keyTakeAway,
          selected: true
        };

        takeawayArray.push(preppedTakeaway);
      }

      slide.keyTakeAways = takeawayArray;
    }
  }

  isEligible(value) {
    if (value !== null && value.trim().length > 0) {
      return value.trim();
    }
  }

  getVideos() {
    if (this.content.meta.hasVideos) {
      const videoLinks = this.content.meta.videoURL.split(';').filter(this.isEligible);

      const videos = [];

      for (const link of videoLinks) {
        const id = link.split('v=')[1];
        const video = {
          link,
          id,
          selected: true
        };

        videos.push(video);
      }

      this.content.meta.videos = videos;
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  updateSelectedList(list, item) {
    if (list.includes(item.trim())) {
      list.splice(list.indexOf(item.trim()), 1);
    } else {
      list.push(item.trim());
    }
  }

  createPDF() {
    const element = document.getElementById('worksheet');
    const opt = {
      margin: [0.5, 1, 1, 1],
      filename: this.content.title + '.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    };

    return {
      element,
      opt
    }
  }

  printPDF() {
    const pdfOptions = this.createPDF();
    html2pdf().set(pdfOptions.opt).from(pdfOptions.element).toPdf().get('pdf').then(pdf => {
      window.open(pdf.output('bloburl'), '_blank');
    });
  }

  savePDF() {
    const pdfOptions = this.createPDF();
    html2pdf().set(pdfOptions.opt).from(pdfOptions.element).save();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
    this.pageIndex = stepper.selectedIndex + 1;
  }

  goForward(stepper: MatStepper) {
    stepper.next();
    this.pageIndex = stepper.selectedIndex + 1;

    if (this.pageIndex > this.pageCount && !this.personalConnectionCanceled) {
      this.openPersonalConnectionDialog();
    }
  }

  goToSlide(stepper: MatStepper, slideIndex) {
    stepper.selectedIndex = slideIndex;
    this.pageIndex = stepper.selectedIndex + 1;

    if (this.pageIndex > this.pageCount && !this.personalConnectionCanceled) {
      this.openPersonalConnectionDialog();
    }
  }

  getHighlightKeys(highlightsMap) {
    return Array.from(highlightsMap.keys());
  }

  openDialog(type, highlight?: Highlight, notes?: string) {
    return this.dialog.open(NotesModalComponent, {
      panelClass: 'full-screen-dialog',
      autoFocus: false, // needed to prevent text area from being focused on when opened
      data: {
        type,
        notes,
        highlight
      }
    });
  }

  openHighlightDialog(slide, highlight) {
    const dialogRef = this.openDialog('highlightNotes', highlight);

    dialogRef.afterClosed().subscribe(
      data => {
        switch (data.action) {
          case 'save':
            highlight.notes = data.notes;
            break;
          case 'delete':
            slide.highlights.splice(slide.highlights.indexOf(highlight), 1);
            break;
          case 'cancel':
          default:
            break;
        }

        slide.highlights = [...slide.highlights];
        this.collectHighlights();
      }
    );
  }

  openNoteDialog(slide) {
    const dialogRef = this.openDialog('notes', null, slide.additionalNotes);

    dialogRef.afterClosed().subscribe(
      data => {
        switch (data.action) {
          case 'save':
            slide.additionalNotes = data.notes;
            break;
          case 'delete':
            slide.additionalNotes = '';
            break;
          case 'cancel':
          default:
            break;
        }
      }
    );
  }

  openPersonalConnectionDialog() {
    const dialogRef = this.openDialog('personal', null, this.content.personalConnection);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          switch (data.action) {
            case 'save':
              this.content.personalConnection = data.notes;
              break;
            case 'delete':
              this.content.personalConnection = '';
              break;
            case 'cancel':
              this.personalConnectionCanceled = true;
              break;
            default:
              break;
          }
        }
      }
    );
  }

  openQuestionDialog(question?) {
    if (!question) {
      question = {
        question: '',
        selected: true,
        custom: true
      };

      this.content.suggestedQuestions.push(question);
    }

    const dialogRef = this.openDialog('question', null, question.question);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          switch (data.action) {
            case 'save':
              question.question = data.notes;
              break;
            case 'delete':
              question.question = '';
              question.selected = false;
              break;
            case 'cancel':
            default:
              break;
          }
        }

        this.filterQuestions();
      }
    );
  }

  filterQuestions() {
    this.content.suggestedQuestions = this.content.suggestedQuestions.filter(suggestedQuestion => suggestedQuestion.question)
  }

  getHighlights() {
    const highlights = [];

    for (const slide of this.content.slides) {
      if (slide.highlights) {
        for (const highlight of slide.highlights) {
          highlights.push(highlight);
        }
      }
    }

    return highlights;
  }

  updateHighlights(text, highlightsMap) {
    // clone the highlights array
    const highlightsArray = [];

    for (const highlightPair of highlightsMap) {
      const [highlightId, highlight] = highlightPair;
      highlight.id = highlightId;
      highlightsArray.push(highlight);
    }

    highlightsArray.sort((a: Highlight, b: Highlight) => {
      return a.start - b.start;
    });

    let tracker = 0;
    const highlightedText = [];

    if (highlightsArray.length === 0) {
      highlightedText.push({
        content: text,
        highlight: false
      });
      return;
    }

    for (const highlight of highlightsArray) {
      if (tracker < highlight.start) {
        // get regular text
        highlightedText.push({
          content: text.substring(tracker, highlight.start),
          highlight: false
        });
        tracker = highlight.start;
      }

      // get highlighted text
      highlightedText.push({
        content: text.substring(highlight.start, highlight.end),
        highlight: true,
        top: highlight.top,
        left: highlight.left,
        id: highlight.id
      });
      tracker = highlight.end;
    }

    highlightedText.push({
      content: text.substring(tracker, text.length),
      highlight: false
    });

    return highlightedText;
  }
}
